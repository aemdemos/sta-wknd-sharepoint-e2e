/* global WebImporter */
export default function parse(element, { document }) {
  function filterEmptyGridDivs(nodes) {
    return Array.from(nodes).filter(n => {
      if (n.nodeType === 1 && n.classList && n.classList.contains('aem-Grid')) {
        return n.textContent.trim().length > 0;
      }
      if (n.nodeType === Node.TEXT_NODE) {
        return n.textContent.trim().length > 0;
      }
      return true;
    });
  }

  const mainContent = element.querySelector('.contentfragment article.cmp-contentfragment');
  if (!mainContent) return;
  const elementsRoot = mainContent.querySelector('.cmp-contentfragment__elements');
  if (!elementsRoot) return;

  const allNodes = Array.from(elementsRoot.childNodes);
  // Find the index of the first h2
  let firstH2Idx = allNodes.findIndex(n => n.nodeType === 1 && n.tagName.toLowerCase() === 'h2');

  const rows = [["Accordion (accordion15)"]];

  // Always include the intro content row if there is anything before first h2
  const introNodes = filterEmptyGridDivs(allNodes.slice(0, firstH2Idx === -1 ? allNodes.length : firstH2Idx));
  if (introNodes.length > 0) {
    let introCell;
    if (introNodes.length === 1) {
      introCell = introNodes[0];
    } else {
      const frag = document.createDocumentFragment();
      introNodes.forEach(n => frag.appendChild(n));
      introCell = frag;
    }
    rows.push([introCell, '']); // Intro in first cell, second cell empty
  }

  // Parse accordion sections (from h2 onwards)
  let idx = firstH2Idx;
  while (idx > -1 && idx < allNodes.length) {
    const titleNode = allNodes[idx];
    if (!titleNode || !(titleNode.nodeType === 1 && titleNode.tagName.toLowerCase() === 'h2')) break;
    let contentNodes = [];
    let j = idx + 1;
    while (j < allNodes.length && !(allNodes[j].nodeType === 1 && allNodes[j].tagName.toLowerCase() === 'h2')) {
      contentNodes.push(allNodes[j]);
      j++;
    }
    const filtered = filterEmptyGridDivs(contentNodes);
    let contentCell;
    if (filtered.length === 1) {
      contentCell = filtered[0];
    } else if (filtered.length > 1) {
      const frag = document.createDocumentFragment();
      filtered.forEach(n => frag.appendChild(n));
      contentCell = frag;
    } else {
      contentCell = document.createElement('div');
    }
    rows.push([titleNode, contentCell]);
    idx = j;
  }

  const block = WebImporter.DOMUtils.createTable(rows, document);
  mainContent.replaceWith(block);
}
