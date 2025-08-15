/**
 * Layered Skill Galaxy - Multi-Ring Concentric Model
 * Center: Core Identity | Ring 1: Domains | Ring 2: Subskills | Ring 3: Tools
 */
(function() {
  const CENTER = { label: 'Applied AI / Product Data Science' };

  const RING1_DOMAINS = [
    { id: 'product-ds', label: 'Product DS', color: '#6366f1' },
    { id: 'genai', label: 'GenAI', color: '#f59e0b' },
    { id: 'cloud', label: 'Cloud', color: '#ef4444' },
    { id: 'nlp', label: 'NLP', color: '#06b6d4' },
    { id: 'stats', label: 'Stats', color: '#8b5cf6' },
    { id: 'agentic', label: 'Agentic AI', color: '#eab308' },
    { id: 'ml', label: 'ML Frameworks', color: '#ec4899' },
  ];

  const RING2_SUBSKILLS = [
    { name: 'A/B Testing', domain: 'product-ds' },
    { name: 'Causal Inference', domain: 'product-ds' },
    { name: 'Experimentation', domain: 'product-ds' },
    { name: 'KPI Design', domain: 'product-ds' },
    { name: 'RAG', domain: 'genai' },
    { name: 'Prompt Engineering', domain: 'genai' },
    { name: 'LLM Agents', domain: 'agentic' },
    { name: 'Tool Use', domain: 'agentic' },
    { name: 'Multi-Agent', domain: 'agentic' },
    { name: 'ReAct / CoT', domain: 'agentic' },
    { name: 'Transformers', domain: 'nlp' },
    { name: 'Semantic Similarity', domain: 'nlp' },
    { name: 'Bayesian Modeling', domain: 'stats' },
    { name: 'Time Series', domain: 'stats' },
    { name: 'Infrastructure', domain: 'cloud' },
  ];

  const RING3_TOOLS = [
    { name: 'PyTorch', domain: 'ml' },
    { name: 'HuggingFace', domain: 'ml' },
    { name: 'Scikit-Learn', domain: 'ml' },
    { name: 'AWS', domain: 'cloud' },
    { name: 'Lambda', domain: 'cloud' },
    { name: 'Step Functions', domain: 'cloud' },
    { name: 'Athena', domain: 'cloud' },
    { name: 'PySpark', domain: 'cloud' },
    { name: 'Python', domain: 'product-ds' },
    { name: 'SQL', domain: 'product-ds' },
    { name: 'Ollama', domain: 'genai' },
    { name: 'Whisper', domain: 'nlp' },
  ];

  const DOMAIN_COLORS = Object.fromEntries(RING1_DOMAINS.map(d => [d.id, d.color]));

  const container = document.getElementById('skill-graph');
  if (!container) return;
  container.classList.add('skill-galaxy');

  const w = container.clientWidth || 600;
  const h = Math.min(600, w * 0.98);
  const cx = w / 2;
  const cy = h / 2;
  const padding = 80;

  const r0 = 0;      // center
  const r1 = 90;     // Ring 1: Domains
  const r2 = 165;    // Ring 2: Subskills
  const r3 = 240;    // Ring 3: Tools

  function placeOnRing(items, radius, startAngle = -Math.PI / 2) {
    const n = items.length;
    const step = (2 * Math.PI) / n;
    return items.map((item, i) => {
      const angle = startAngle + i * step;
      return {
        ...item,
        x: cx + radius * Math.cos(angle),
        y: cy + radius * Math.sin(angle),
        angle,
      };
    });
  }

  const domainNodes = placeOnRing(RING1_DOMAINS, r1);
  const subskillNodes = placeOnRing(RING2_SUBSKILLS, r2);
  const toolNodes = placeOnRing(RING3_TOOLS, r3);

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '100%');
  svg.setAttribute('class', 'skill-galaxy-svg');

  // Subtle ring guides
  [r1, r2, r3].forEach((r, i) => {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', cx);
    circle.setAttribute('cy', cy);
    circle.setAttribute('r', r);
    circle.setAttribute('fill', 'none');
    circle.setAttribute('stroke', 'rgba(255,255,255,0.08)');
    circle.setAttribute('stroke-width', '1');
    circle.setAttribute('class', 'galaxy-ring-guide');
    svg.appendChild(circle);
  });

  // Center
  const gCenter = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  gCenter.setAttribute('class', 'galaxy-center');
  gCenter.setAttribute('transform', `translate(${cx},${cy})`);
  const centerBg = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  centerBg.setAttribute('r', 32);
  centerBg.setAttribute('fill', 'var(--accent)');
  centerBg.setAttribute('stroke', 'rgba(255,255,255,0.4)');
  centerBg.setAttribute('stroke-width', '2');
  const centerText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  centerText.textContent = 'Applied AI / Product DS';
  centerText.setAttribute('y', 5);
  centerText.setAttribute('text-anchor', 'middle');
  centerText.setAttribute('class', 'galaxy-center-label');
  centerText.setAttribute('font-size', '9');
  gCenter.appendChild(centerBg);
  gCenter.appendChild(centerText);
  svg.appendChild(gCenter);

  function createNode(g, node, r, ringClass, labelClass) {
    const el = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    el.setAttribute('class', ringClass);
    el.setAttribute('transform', `translate(${node.x},${node.y})`);
    el.dataset.domain = node.domain || node.id;
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('r', r);
    const color = node.color || DOMAIN_COLORS[node.domain];
    circle.setAttribute('fill', color || 'var(--accent)');
    circle.setAttribute('stroke', 'rgba(255,255,255,0.4)');
    circle.setAttribute('stroke-width', '1.5');
    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.textContent = node.label || node.name;
    const angle = node.angle * 180 / Math.PI;
    const rightSide = angle > -90 && angle < 90;
    label.setAttribute('x', rightSide ? r + 8 : -r - 8);
    label.setAttribute('y', 4);
    label.setAttribute('text-anchor', rightSide ? 'start' : 'end');
    label.setAttribute('class', labelClass);
    el.appendChild(circle);
    el.appendChild(label);
    g.appendChild(el);
    return el;
  }

  const gRing1 = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  gRing1.setAttribute('class', 'galaxy-ring galaxy-ring-1');
  domainNodes.forEach(n => createNode(gRing1, n, 18, 'galaxy-domain', 'galaxy-domain-label'));
  svg.appendChild(gRing1);

  const gRing2 = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  gRing2.setAttribute('class', 'galaxy-ring galaxy-ring-2');
  subskillNodes.forEach(n => createNode(gRing2, n, 14, 'galaxy-subskill', 'galaxy-subskill-label'));
  svg.appendChild(gRing2);

  const gRing3 = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  gRing3.setAttribute('class', 'galaxy-ring galaxy-ring-3');
  toolNodes.forEach(n => createNode(gRing3, n, 11, 'galaxy-tool', 'galaxy-tool-label'));
  svg.appendChild(gRing3);

  const tooltip = document.createElement('div');
  tooltip.className = 'skill-graph-tooltip';

  const graphWrapper = document.createElement('div');
  graphWrapper.className = 'skill-graph-wrapper';
  graphWrapper.appendChild(svg);
  graphWrapper.appendChild(tooltip);

  function showTooltip(evt, text) {
    tooltip.textContent = text;
    tooltip.style.display = 'block';
    tooltip.style.left = evt.clientX + 'px';
    tooltip.style.top = (evt.clientY + 16) + 'px';
  }
  function hideTooltip() {
    tooltip.style.display = 'none';
  }

  function setHighlight(domain) {
    [gRing1, gRing2, gRing3].forEach(g => {
      g.querySelectorAll('[data-domain]').forEach(el => {
        el.classList.toggle('active', domain ? el.dataset.domain === domain : false);
      });
    });
  }

  function addListeners(g) {
    g.querySelectorAll('[data-domain]').forEach(el => {
      const domain = el.dataset.domain;
      const domainInfo = RING1_DOMAINS.find(d => d.id === domain);
      const label = el.querySelector('text')?.textContent || domainInfo?.label || domain;
      el.addEventListener('mouseenter', (e) => {
        setHighlight(domain);
        showTooltip(e, label);
      });
      el.addEventListener('mousemove', (e) => {
        tooltip.style.left = e.clientX + 'px';
        tooltip.style.top = (e.clientY + 16) + 'px';
      });
      el.addEventListener('mouseleave', () => {
        setHighlight(null);
        hideTooltip();
      });
    });
  }
  addListeners(gRing1);
  addListeners(gRing2);
  addListeners(gRing3);

  gCenter.addEventListener('mouseenter', (e) => {
    showTooltip(e, CENTER.label);
    gCenter.classList.add('active');
  });
  gCenter.addEventListener('mousemove', (e) => {
    tooltip.style.left = e.clientX + 'px';
    tooltip.style.top = (e.clientY + 16) + 'px';
  });
  gCenter.addEventListener('mouseleave', () => {
    hideTooltip();
    gCenter.classList.remove('active');
  });

  const hint = document.createElement('p');
  hint.className = 'skill-graph-hint';
  hint.textContent = 'Hover over rings to explore · Core → Domains → Subskills → Tools';
  graphWrapper.appendChild(hint);
  container.appendChild(graphWrapper);

  const legend = document.createElement('div');
  legend.className = 'skill-graph-legend';
  const ringLabels = [
    { label: 'Center: Core Identity', class: 'legend-ring0' },
    { label: 'Ring 1: Domains', class: 'legend-ring1' },
    { label: 'Ring 2: Subskills', class: 'legend-ring2' },
    { label: 'Ring 3: Tools', class: 'legend-ring3' },
  ];
  ringLabels.forEach(({ label, class: c }) => {
    const item = document.createElement('span');
    item.className = 'legend-item ' + c;
    item.textContent = label;
    legend.appendChild(item);
  });
  container.appendChild(legend);
})();
