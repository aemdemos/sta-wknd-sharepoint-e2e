/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to skip empty grid wrappers
  function isEmptyGrid(el) {
    return (
      el &&
      el.classList.contains('aem-Grid') &&
      el.children.length === 0
    );
  }

  // Get the main contentfragment article
  const mainContent = element.querySelector('article.contentfragment');
  if (!mainContent) return;
  const cfElements = mainContent.querySelector('.cmp-contentfragment__elements');
  if (!cfElements) return;

  // Get the H1 title for the intro (reference existing element if possible)
  let introTitle = element.querySelector('h1, .cmp-title__text');
  if (!introTitle) {
    introTitle = document.createElement('span');
    introTitle.textContent = '';
  }

  // Gather all direct children (including text)
  const children = Array.from(cfElements.childNodes).filter(n => n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim() !== ''));
  let idx = 0;
  // Gather intro content (up to first H2)
  const introContentContainer = document.createElement('div');
  while (idx < children.length && !(children[idx].tagName && children[idx].tagName.toUpperCase() === 'H2')) {
    const node = children[idx];
    // Skip empty grids
    if (node.nodeType === 1 && node.classList && node.classList.contains('aem-Grid') && node.children.length === 0) {
      idx++;
      continue;
    }
    introContentContainer.appendChild(node);
    idx++;
  }

  const rows = [ [introTitle, introContentContainer] ];

  // Now, for each accordion section (starting at H2)
  while (idx < children.length) {
    // Find the next title (H2)
    let sectionTitle = null;
    while (idx < children.length && !(children[idx].tagName && children[idx].tagName.toUpperCase() === 'H2')) {
      idx++;
    }
    if (idx < children.length && children[idx].tagName && children[idx].tagName.toUpperCase() === 'H2') {
      sectionTitle = children[idx];
      idx++;
    } else {
      break; // no more sections
    }
    // Gather content until next H2
    const sectionContentContainer = document.createElement('div');
    while (idx < children.length && !(children[idx].tagName && children[idx].tagName.toUpperCase() === 'H2')) {
      const node = children[idx];
      // Skip empty grid wrappers
      if (node.nodeType === 1 && node.classList && node.classList.contains('aem-Grid') && node.children.length === 0) {
        idx++;
        continue;
      }
      sectionContentContainer.appendChild(node);
      idx++;
    }
    if (sectionTitle && sectionContentContainer.childNodes.length > 0) {
      rows.push([sectionTitle, sectionContentContainer]);
    }
  }

  // Block table: first row is header, rest are 2 columns
  const cells = [];
  cells.push(['Accordion (accordion32)']);
  rows.forEach(row => cells.push(row));

  // Use createTable helper
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
