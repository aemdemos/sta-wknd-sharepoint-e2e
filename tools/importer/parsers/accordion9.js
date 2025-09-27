/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main article container (contentfragment)
  const contentFragment = element.querySelector('.contentfragment .cmp-contentfragment');
  if (!contentFragment) return;

  // Get the main title (h1) and author (h4) if present
  const mainTitle = element.querySelector('.title .cmp-title__text');

  // Get the elements inside the contentfragment
  const cfElements = contentFragment.querySelector('.cmp-contentfragment__elements');
  if (!cfElements) return;

  // We'll collect all nodes (elements and text) inside cfElements
  const nodes = Array.from(cfElements.childNodes);

  // Helper: find all h2.cmp-title__text (section titles)
  const sectionTitles = [];
  nodes.forEach((node, idx) => {
    if (
      node.nodeType === 1 &&
      node.querySelector &&
      node.querySelector('h2.cmp-title__text')
    ) {
      sectionTitles.push({
        idx,
        el: node.querySelector('h2.cmp-title__text'),
        container: node,
      });
    }
  });

  // Build accordion rows
  const rows = [];

  // 1. Intro section (everything before first h2)
  let introStart = 0;
  let introEnd = sectionTitles.length > 0 ? sectionTitles[0].idx : nodes.length;
  // Collect all nodes in this range
  const introNodes = nodes.slice(introStart, introEnd).filter(n => {
    // Remove empty grids and whitespace
    if (n.nodeType === 3 && !n.textContent.trim()) return false;
    if (n.nodeType === 1 && n.matches('div') && n.innerHTML.trim() === '') return false;
    return true;
  });
  if (introNodes.length > 0 && introNodes.some(n => (n.nodeType === 3 ? n.textContent.trim() : n.innerHTML.trim()))) {
    // Title: use mainTitle text
    const introTitle = mainTitle ? mainTitle.cloneNode(true) : document.createElement('span');
    // Content: all introNodes
    // FIX: Flatten introNodes to include all text content recursively
    const introContent = introNodes.map(n => n.cloneNode(true));
    rows.push([
      introTitle,
      introContent
    ]);
  }

  // 2. Each section (h2 + content until next h2)
  for (let i = 0; i < sectionTitles.length; i++) {
    const thisTitle = sectionTitles[i];
    const nextIdx = sectionTitles[i + 1] ? sectionTitles[i + 1].idx : nodes.length;
    // Section content is everything after thisTitle.container up to nextIdx
    const titleEl = thisTitle.el.cloneNode(true);
    let contentNodes = [];
    const containerIdx = nodes.indexOf(thisTitle.container);
    for (let j = containerIdx + 1; j < nextIdx; j++) {
      const n = nodes[j];
      if (n.nodeType === 3 && !n.textContent.trim()) continue;
      if (n.nodeType === 1 && n.matches('div') && n.innerHTML.trim() === '') continue;
      contentNodes.push(n);
    }
    // FIX: Flatten contentNodes to include all text content recursively
    const sectionContent = contentNodes.map(n => n.cloneNode(true));
    // Only add row if there is actual content (not just empty wrappers)
    if (sectionContent.length > 0 && sectionContent.some(n => (n.nodeType === 3 ? n.textContent.trim() : n.innerHTML.trim()))) {
      rows.push([
        titleEl,
        sectionContent
      ]);
    }
  }

  // Table header row
  const headerRow = ['Accordion (accordion9)'];
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
