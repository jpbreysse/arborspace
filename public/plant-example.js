// Interactive "one plant, one model, three questions" example (src/components/PlantExample.astro).
(() => {
  if (!document.getElementById('plant-q')) return;
  const Q = {
    impact: {
      q: 'If the GT1 inspection takes 15 days instead of 12, what does the lender lose?',
      nodes: ['A', 'D', 'G', 'H', 'I', 'J'], edges: [1, 6, 7, 9, 11],
      path: ['Maintenance plan', 'GT1', 'HRSG1', 'Steam turbine', 'Block', 'Loan'],
      links: ['temporal', 'physical', 'hierarchical', 'financial'],
      answer: 'Stopping GT1 also cuts half the steam to the steam turbine: the block loses <strong>306 MW</strong>, half its output rather than a third. Three extra days mean roughly <strong>22,000 MWh</strong> of lost generation.',
    },
    cause: {
      q: 'Why is 2027 generation at risk of falling short of plan?',
      nodes: ['J', 'I', 'H', 'E', 'F', 'B'], edges: [11, 9, 8, 5, 3],
      path: ['Loan', 'Block', 'Steam turbine', 'GT2', 'Meters', 'AT-700F model'],
      links: ['financial', 'hierarchical', 'physical', 'measurement', 'manufacturer'],
      answer: 'GT2 is already <strong>8%</strong> past its manufacturer inspection interval, while the plan defers that inspection to 2027. An unplanned outage becomes plausible.',
    },
    precedent: {
      q: 'Which other assets use this turbine model, and what happened there?',
      nodes: ['D', 'E', 'B', 'C'], edges: [2, 3, 4],
      path: ['GT1 and GT2', 'AT-700F model', 'Plant B'],
      links: ['manufacturer'],
      answer: 'Plant B runs the same model. Its comparable inspection <strong>ran over the planned duration</strong>. That precedent weighs on the credibility of Alder Creek’s plan, and the system is what brings it up.',
    },
  };
  const $ = (id) => document.getElementById(id);
  const tabs = document.querySelectorAll('.plant-tab');
  const chips = (el, items, arrows) => {
    el.replaceChildren();
    items.forEach((t, i) => {
      const s = document.createElement('span');
      s.className = 'plant-chip';
      s.textContent = t;
      el.appendChild(s);
      if (arrows && i < items.length - 1) {
        const a = document.createElement('span');
        a.className = 'plant-arrow';
        a.textContent = '→';
        el.appendChild(a);
      }
    });
  };
  function show(key) {
    const s = Q[key];
    'ABCDEFGHIJ'.split('').forEach((n) => $('plant-n' + n).classList.toggle('on', s.nodes.includes(n)));
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 11].forEach((i) => $('plant-e' + i).classList.toggle('on', s.edges.includes(i)));
    tabs.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.q === key)));
    $('plant-q').textContent = s.q;
    chips($('plant-path'), s.path, true);
    chips($('plant-links'), s.links, false);
    $('plant-answer').innerHTML = s.answer;
  }
  tabs.forEach((b) => b.addEventListener('click', () => show(b.dataset.q)));
  show('impact');
})();
