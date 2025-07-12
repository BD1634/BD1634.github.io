/**
 * Interactive skill tree - radial hierarchy
 */
(function() {
  const SKILLS = [
    { name: 'Python', category: 'Software Engg' },
    { name: 'SQL', category: 'Software Engg' },
    { name: 'JavaScript', category: 'Software Engg' },
    { name: 'C', category: 'Software Engg' },
    { name: 'MATLAB', category: 'Software Engg' },
    { name: 'R', category: 'Software Engg' },
    { name: 'Causal Inference', category: 'Product DS' },
    { name: 'A/B Testing', category: 'Product DS' },
    { name: 'Experimentation', category: 'Product DS' },
    { name: 'KPI Design', category: 'Product DS' },
    { name: 'Bayesian Modeling', category: 'Statistics' },
    { name: 'Survival Analysis', category: 'Statistics' },
    { name: 'Transformers', category: 'NLP' },
    { name: 'Semantic Similarity', category: 'NLP' },
    { name: 'RAG', category: 'GenAI' },
    { name: 'Prompt Engineering', category: 'GenAI' },
    { name: 'LLM Agents', category: 'Agentic AI' },
    { name: 'Tool Use', category: 'Agentic AI' },
    { name: 'Multi-Agent Systems', category: 'Agentic AI' },
    { name: 'ReAct / CoT', category: 'Agentic AI' },
    { name: 'PyTorch', category: 'ML Frameworks' },
    { name: 'TensorFlow', category: 'ML Frameworks' },
    { name: 'Scikit-Learn', category: 'ML Frameworks' },
    { name: 'Hugging Face', category: 'ML Frameworks' },
    { name: 'PySpark', category: 'Finance' },
    { name: 'AWS', category: 'Cloud & Infra' },
    { name: 'Lambda', category: 'Cloud & Infra' },
    { name: 'Step Functions', category: 'Cloud & Infra' },
    { name: 'Fargate', category: 'Cloud & Infra' },
    { name: 'Athena', category: 'Cloud & Infra' },
    { name: 'GCP', category: 'Cloud & Infra' },
    { name: 'Vertex AI', category: 'Cloud & Infra' },
  ];

  const CATEGORY_COLORS = {
    'Software Engg': '#00d4aa',
    'Product DS': '#6366f1',
    'Statistics': '#8b5cf6',
    'NLP': '#06b6d4',
    'GenAI': '#f59e0b',
    'Agentic AI': '#eab308',
    'ML Frameworks': '#ec4899',
    'Finance': '#10b981',
    'Cloud & Infra': '#ef4444',
  };

  const CATEGORY_ORDER = [
    'Software Engg', 'Product DS', 'Statistics', 'NLP',
    'GenAI', 'Agentic AI', 'ML Frameworks', 'Finance', 'Cloud & Infra'
  ];

  const container = document.getElementById('skill-graph');
  if (!container) return;
  container.classList.add('skill-tree');

  const w = container.clientWidth || 600;
  const h = Math.min(620, w * 1.0);
  const cx = w / 2;
  const cy = h / 2;

  // Build tree: root -> categories -> skills
  const categories = CATEGORY_ORDER.filter(cat =>
    SKILLS.some(s => s.category === cat)
  );
  const offsetY = 40;
  const root = { id: 'root', label: 'Expertise', x: cx, y: cy - 60 + offsetY, children: [] };

  const r1 = 125;  // radius to category nodes (ring around center Expertise)
  const r2 = 270;  // radius to skill leaves
  const wedgeSpan = (2 * Math.PI) / categories.length; // each category gets its own wedge

  const categoryNodes = [];
  categories.forEach((cat, i) => {
    const angle = (i + 0.5) / categories.length * 2 * Math.PI - Math.PI / 2;
    const skills = SKILLS.filter(s => s.category === cat);
    const catX = cx + r1 * Math.cos(angle);
    const catY = cy - 60 + offsetY + r1 * Math.sin(angle);
    categoryNodes.push({ id: cat, label: cat, x: catX, y: catY, angle, skills });
  });

  // Position skills within their category's wedge only
  const skillNodes = [];
  categoryNodes.forEach(catNode => {
    const n = catNode.skills.length;
    const halfWedge = wedgeSpan * 0.5;
    const spread = n > 1 ? (2 * halfWedge) / Math.max(1, n - 1) : 0;
    const r = r2 + Math.min(70, (n - 1) * 14);
    catNode.skills.forEach((s, j) => {
      const t = n > 1 ? -halfWedge + j * spread : 0;
      const a = catNode.angle + t;
      skillNodes.push({
        ...s,
        x: cx + r * Math.cos(a),
        y: cy - 60 + offsetY + r * Math.sin(a),
        parentX: catNode.x,
        parentY: catNode.y,
      });
    });
  });

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '100%');
  svg.setAttribute('class', 'skill-graph-svg skill-tree-svg');

  // Links: root -> categories -> skills
  const gLinks = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  gLinks.setAttribute('class', 'skill-tree-links');

  categoryNodes.forEach(cat => {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', root.x);
    line.setAttribute('y1', root.y);
    line.setAttribute('x2', cat.x);
    line.setAttribute('y2', cat.y);
    line.setAttribute('class', 'skill-tree-link skill-tree-link-branch');
    gLinks.appendChild(line);
  });

  skillNodes.forEach(skill => {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', skill.parentX);
    line.setAttribute('y1', skill.parentY);
    line.setAttribute('x2', skill.x);
    line.setAttribute('y2', skill.y);
    line.setAttribute('class', 'skill-tree-link skill-tree-link-leaf');
    line.dataset.category = skill.category;
    gLinks.appendChild(line);
  });

  svg.appendChild(gLinks);

  // Root node
  const gRoot = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  gRoot.setAttribute('class', 'skill-tree-root');
  gRoot.setAttribute('transform', `translate(${root.x},${root.y})`);
  const rootCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  rootCircle.setAttribute('r', 18);
  rootCircle.setAttribute('fill', 'var(--accent)');
  rootCircle.setAttribute('stroke', 'rgba(255,255,255,0.3)');
  rootCircle.setAttribute('stroke-width', '1');
  const rootLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  rootLabel.textContent = root.label;
  rootLabel.setAttribute('y', 38);
  rootLabel.setAttribute('text-anchor', 'middle');
  rootLabel.setAttribute('class', 'skill-tree-root-label');
  gRoot.appendChild(rootCircle);
  gRoot.appendChild(rootLabel);
  svg.appendChild(gRoot);

  // Category nodes
  const gCategories = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  gCategories.setAttribute('class', 'skill-tree-categories');
  categoryNodes.forEach(cat => {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('class', 'skill-tree-category');
    g.setAttribute('transform', `translate(${cat.x},${cat.y})`);
    g.dataset.category = cat.id;
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('r', 14);
    circle.setAttribute('fill', CATEGORY_COLORS[cat.id]);
    circle.setAttribute('stroke', 'rgba(255,255,255,0.4)');
    circle.setAttribute('stroke-width', '1');
    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.textContent = cat.label;
    label.setAttribute('y', 28);
    label.setAttribute('text-anchor', 'middle');
    label.setAttribute('class', 'skill-tree-category-label');
    g.appendChild(circle);
    g.appendChild(label);
    gCategories.appendChild(g);
  });
  svg.appendChild(gCategories);

  // Skill nodes (leaves)
  const gSkills = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  gSkills.setAttribute('class', 'skill-tree-skills');
  skillNodes.forEach((skill, i) => {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('class', 'skill-tree-skill');
    g.setAttribute('transform', `translate(${skill.x},${skill.y})`);
    g.dataset.name = skill.name;
    g.dataset.category = skill.category;
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('r', 10);
    circle.setAttribute('fill', CATEGORY_COLORS[skill.category]);
    circle.setAttribute('stroke', 'rgba(255,255,255,0.3)');
    circle.setAttribute('stroke-width', '1');
    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.textContent = skill.name;
    const angle = Math.atan2(skill.y - (cy - 60), skill.x - cx);
    const rightSide = angle > -Math.PI/2 && angle < Math.PI/2;
    label.setAttribute('x', rightSide ? 14 : -14);
    label.setAttribute('y', 4);
    label.setAttribute('text-anchor', rightSide ? 'start' : 'end');
    label.setAttribute('class', 'skill-tree-skill-label');
    g.appendChild(circle);
    g.appendChild(label);
    gSkills.appendChild(g);
  });
  svg.appendChild(gSkills);

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

  function setCategoryHighlight(cat) {
    gCategories.querySelectorAll('.skill-tree-category').forEach(g => {
      g.classList.toggle('active', g.dataset.category === cat);
    });
    gSkills.querySelectorAll('.skill-tree-skill').forEach(g => {
      g.classList.toggle('active', g.dataset.category === cat);
    });
    gLinks.querySelectorAll('.skill-tree-link-leaf').forEach(line => {
      line.classList.toggle('active', line.dataset.category === cat);
    });
  }

  gCategories.querySelectorAll('.skill-tree-category').forEach(g => {
    g.addEventListener('mouseenter', (e) => {
      setCategoryHighlight(g.dataset.category);
      showTooltip(e, g.dataset.category);
    });
    g.addEventListener('mousemove', (e) => {
      tooltip.style.left = e.clientX + 'px';
      tooltip.style.top = (e.clientY + 16) + 'px';
    });
    g.addEventListener('mouseleave', () => {
      setCategoryHighlight(null);
      hideTooltip();
    });
  });

  gSkills.querySelectorAll('.skill-tree-skill').forEach(g => {
    g.addEventListener('mouseenter', (e) => {
      setCategoryHighlight(g.dataset.category);
      showTooltip(e, `${g.dataset.name} · ${g.dataset.category}`);
    });
    g.addEventListener('mousemove', (e) => {
      tooltip.style.left = e.clientX + 'px';
      tooltip.style.top = (e.clientY + 16) + 'px';
    });
    g.addEventListener('mouseleave', () => {
      setCategoryHighlight(null);
      hideTooltip();
    });
  });

  const hint = document.createElement('p');
  hint.className = 'skill-graph-hint';
  hint.textContent = 'Hover over categories or skills to highlight';
  graphWrapper.appendChild(hint);
  container.appendChild(graphWrapper);

  const legend = document.createElement('div');
  legend.className = 'skill-graph-legend';
  CATEGORY_ORDER.forEach(cat => {
    if (!(cat in CATEGORY_COLORS)) return;
    const dot = document.createElement('span');
    dot.className = 'legend-dot';
    dot.style.background = CATEGORY_COLORS[cat];
    const text = document.createElement('span');
    text.textContent = cat;
    const item = document.createElement('span');
    item.className = 'legend-item';
    item.appendChild(dot);
    item.appendChild(text);
    legend.appendChild(item);
  });
  container.appendChild(legend);
})();
