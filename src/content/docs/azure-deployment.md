---
title: Reference deployment on Azure
description: What ArborSpace runs on in your own Azure subscription, and how updates, backups and sign-in work.
audience: IT teams
order: 3
---

ArborSpace runs in your environment. This page describes the reference deployment on Azure. For an installation on your own premises, see [Deployment](/product/deployment).

## What gets installed

Three components, delivered as container images:

- **The applications:** web apps for the ontology, the asset registry and the review queue.
- **A PostgreSQL database:** all rules, objects and findings live here.
- **File storage:** for the documents attached to assets and findings.

Nothing else. No agent on user machines, no proprietary database.

## Azure resources

| Component | Azure resource |
|---|---|
| Applications | App Service or Container Apps |
| Database | Azure Database for PostgreSQL, Flexible Server |
| File storage | Blob Storage |
| Secrets | Key Vault |
| Container images | Your own container registry |

Everything is deployed in your subscription, in the region you choose.

## Network and data

Nothing leaves your network. Rules run inside the application, and no data is sent to ArborSpace or to a third party.

AI inference runs on a model endpoint in your own cloud, for example Azure OpenAI in your subscription.

## Operations

| Topic | How it works |
|---|---|
| Operation | You, or ArborSpace on your infrastructure, with access you grant and can revoke. |
| Updates | A new image is pushed to your registry. You decide when to deploy it. |
| Sign-in | Local accounts today. Single sign-on with Entra ID is planned. |
| Backups | It is your PostgreSQL: your existing backup tools and policies apply. |
| Leaving | A standard PostgreSQL dump. Your rules and data stay readable without ArborSpace. |

## Security

A security file is available for your IT director, and the code can be reviewed on request, with repository access under licence.
