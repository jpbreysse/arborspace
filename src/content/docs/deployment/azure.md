---
title: Reference deployment on Azure
description: How ArborSpace is deployed in your own Azure subscription, step by step, from access to network.
audience: IT teams
order: 1
---

ArborSpace is deployed in your Azure subscription, on a **vendor-operated, customer-hosted** model: the source code stays with ArborSpace, and only the container image is delivered. This page walks through the reference deployment. For an overview, see [Deployment](/product/deployment).

## What gets deployed

| Resource | Role |
|---|---|
| Container registry (ACR) | Holds the ArborSpace image, in your subscription. |
| App Service plan and Web App | Run the container. |
| PostgreSQL Flexible Server | All rules, objects and findings. |
| Key Vault | Secrets, read by the application’s managed identity. |

Everything lives in one resource group, in the region you choose. Nothing leaves your network: no data is sent to ArborSpace or to a third party.

The commands below use these variables:

```bash
RG=<prefix>-arborspace-prod-<region>-rg      # resource group
LOCATION=<azure-region>                      # for example westeurope
ACR=<prefix>arborspaceprod<region>acr        # registry: no hyphens allowed
APP=<prefix>-arborspace-prod-<region>-app    # web app
SUB=<subscription-id>
```

## 1. Access

Two separate actions are needed on your side, and adding someone to a Teams conversation does neither:

1. **A guest account** in your tenant, on the identity ArborSpace uses to contact you. The invitation arrives from `invitations@microsoft.com` and must be accepted: until the link is clicked, your tenant does not appear anywhere.
2. **A role assignment:** Owner, on the ArborSpace resource group only. Nothing at subscription level.

Two symptoms, and what they mean:

- **Your tenant does not appear** in *Portal settings → Directories + subscriptions*: no guest account exists yet for that identity.
- **Error `AADSTS90072`** when forcing the tenant in the URL: the tenant exists, but the account has not been added as an external user.

Once the invitation is accepted, the command-line sign-in:

```bash
az login --tenant <your-domain> --use-device-code --output none
az account set --subscription $SUB
```

**Plan for this step.** Creating the guest account and the role assignment can take several days in a large organisation. The deployment does not depend on any date: a demonstration can run in the meantime from the existing environment, on synthetic data.

## 2. Check the environment

Before creating anything, check what the access allows:

```bash
az group list -o table
az role assignment list --scope /subscriptions/$SUB/resourceGroups/$RG -o table
az provider list --query "[?namespace=='Microsoft.Web' || namespace=='Microsoft.DBforPostgreSQL' || namespace=='Microsoft.ContainerRegistry' || namespace=='Microsoft.KeyVault'].[namespace,registrationState]" -o table
```

The four resource providers must be `Registered`. Registering one is a subscription-level operation, out of reach of a role limited to the resource group: if one is missing, your team registers it.

In the portal, the label “Resource access” in the *My role* column is not a role: it means the subscription is visible because of rights on something inside it. “Current cost: Unauthorized” on the same line says the same thing.

## 3. Permissions: RBAC and Azure Policy

Two mechanisms apply at the same time. **RBAC** says what you are allowed to do; **Azure Policy** says whether what you create is compliant. You can be Owner and still see a creation refused.

- A role is assigned at a scope and inherits downwards only.
- A policy comes down from where it is assigned, and no role overrides it: a role grants permissions, a policy sets prohibitions, and the prohibition wins.

With Owner on the resource group, ArborSpace can create, change and delete resources inside it, and assign roles there (which is what lets it give managed identities access to the registry and the Key Vault without asking you). Above it, nothing: no other resource group, no cost reading, no provider registration.

| Error code | Meaning |
|---|---|
| `AuthorizationFailed` | The role is not sufficient. |
| `MissingSubscriptionRegistration` | A resource provider is not registered. |
| `RequestDisallowedByPolicy` | A policy blocks the creation. The message names the policy. |

Policies inherited from the management group do not show up in a policy listing limited to the resource group. The reliable test is a real creation, which is why the registry comes first.

## 4. Container registry

The registry is the first resource created, and it doubles as a compliance probe: it is the resource type most often governed by policy (encryption, public network access, minimum TLS).

```bash
az acr create --name $ACR --resource-group $RG --sku Basic --location $LOCATION
```

In the response, check:

| Field | Expected | Why |
|---|---|---|
| `adminUserEnabled` | `false` | No username and password pair. Keep the default. |
| `azureAdAuthenticationAsArmPolicy` | `enabled` | Entra identity authentication will work. |
| `publicNetworkAccess` | `Enabled` | A push from a workstation remains possible. |

A Basic registry costs in the order of 5 USD a month, billed to your subscription. It can be deleted at any time.

## 5. Image

The image must be built for `linux/amd64`. A default build on an Apple Silicon Mac produces arm64, which App Service refuses with an unclear message: it is the most common cause of failure on this path.

Either build in Azure, natively in amd64 (this also works with a private registry):

```bash
az acr build --registry $ACR --image arborspace:0.1.0 --file Dockerfile .
```

Or build locally and push:

```bash
az acr login --name $ACR
docker build --platform linux/amd64 -t $ACR.azurecr.io/arborspace:0.1.0 .
docker push $ACR.azurecr.io/arborspace:0.1.0
```

`az acr login` reuses the Azure token: no password is handled.

## 6. Managed identity, no secrets

A managed identity is a service principal created and managed by Azure, attached to a resource, with no secret to store or rotate. The alternative, the registry’s admin user, would put a username and password in the App Service configuration: visible to anyone with access to it, never rotated, and left in shell history and scripts.

```bash
az webapp identity assign --name $APP --resource-group $RG
PRINCIPAL=$(az webapp identity show --name $APP --resource-group $RG --query principalId -o tsv)
ACR_ID=$(az acr show --name $ACR --query id -o tsv)
az role assignment create --assignee $PRINCIPAL --role AcrPull --scope $ACR_ID
az webapp config set --name $APP --resource-group $RG \
  --generic-configurations '{"acrUseManagedIdentityCreds": true}'
```

The same identity reads secrets from Key Vault and signs in to PostgreSQL through Entra ID. The target is an application configuration with no secret at all, which you can check in the portal.

Updates follow the same principle. The deployment pipeline is designed around a service principal with *federated credentials*: GitHub presents an OIDC token, Entra ID checks it against a rule naming the repository and the branch, and issues an Azure token. No secret is stored in GitHub.

## 7. Network

Decide the topology **before** creating the database. PostgreSQL Flexible Server asks at creation for public access or private access through VNet integration, and the choice cannot be undone: changing it means recreating the server and migrating the data.

| Topology | Description | Verdict |
|---|---|---|
| A. All public | App Service exposed, database public with firewall rules | Ruled out: App Service outbound IPs are a shared pool that changes, so you end up allowing all Azure services, hence all tenants. |
| B. Public app, private database | A VNet with two delegated subnets, a private DNS zone, no public IP on the database | The target for a first phase. |
| C. All private | A private endpoint on the App Service as well | A second phase: the app is no longer reachable outside your network. |

Topology B needs three objects:

- a subnet delegated to `Microsoft.DBforPostgreSQL/flexibleServers`, for the database;
- a subnet delegated to `Microsoft.Web/serverFarms`, for the App Service outbound integration;
- a private DNS zone `privatelink.postgres.database.azure.com` linked to the VNet. Without it, name resolution fails.

In many groups the network is centralised: VNets sit in a connectivity subscription and address ranges are allocated by a network team. To check, try creating the VNet:

```bash
az network vnet create --name vnet-arborspace --resource-group $RG \
  --address-prefix 10.42.0.0/16 --subnet-name snet-db --subnet-prefix 10.42.1.0/24
```

If it succeeds, topology B needs no outside help. If a policy refuses it, your network team delegates a subnet, which usually takes a few days.

## 8. Naming and address

ArborSpace follows the naming convention of the resource group you provide: prefix, product, environment, region code, type suffix. Aligning with it avoids naming policy refusals.

| Resource | Name |
|---|---|
| Resource group | `<prefix>-arborspace-prod-<region>-rg` |
| Container registry | `<prefix>arborspaceprod<region>acr` (no hyphens) |
| App Service plan | `<prefix>-arborspace-prod-<region>-plan` |
| Web App | `<prefix>-arborspace-prod-<region>-app` |
| PostgreSQL Flexible Server | `<prefix>-arborspace-prod-<region>-psql` |
| Key Vault | `<prefix>-arborspace-prod-<region>-kv` |

The application answers on `$APP.azurewebsites.net`, with HTTPS and a Microsoft certificate, without configuration. That name is unique across all of Azure, not only in your tenant, so it is checked before the Web App is created:

```bash
az rest --method post \
  --url "https://management.azure.com/subscriptions/$SUB/providers/Microsoft.Web/checkNameAvailability?api-version=2023-01-01" \
  --body "{\"name\":\"$APP\",\"type\":\"Microsoft.Web/sites\"}"
```

A custom domain such as `arborspace.<your-domain>` needs a DNS record in your corporate zone and a certificate, so your infrastructure team. It belongs to a second phase.

## 9. Checks

- **Health endpoint.** A `/health` endpoint serves the App Service health checks and is called after every deployment. Without that call, a pipeline can report success while the container is crash-looping.
- **No broken images.** The push to your registry only happens after the container has passed a smoke test.
- **Two settings local tests do not catch:** the listening port, which App Service injects through the `PORT` variable, and the database connection, which is read from the environment, never hard-coded.
