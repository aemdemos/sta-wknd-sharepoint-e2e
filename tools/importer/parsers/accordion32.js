/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main cmp-contentfragment article
  const article = element.querySelector('article.cmp-contentfragment');
  if (!article) return;
  const cfElements = article.querySelector('.cmp-contentfragment__elements');
  if (!cfElements) return;

  // Get a list of all childNodes (elements and text)
  const allNodes = Array.from(cfElements.childNodes).filter(n => {
    // Remove empty text nodes
    if (n.nodeType === 3) return n.textContent.trim();
    // Remove empty grid wrappers
    if (n.nodeType === 1 && n.classList.contains('aem-Grid') && n.children.length === 0) return false;
    return true;
  });

  // Find the indices of all cmp-title h2s to define the start of each accordion section
  const sectionIndexes = [];
  for (let i = 0; i < allNodes.length; i++) {
    const node = allNodes[i];
    if (node.nodeType === 1 && node.classList.contains('cmp-title') && node.querySelector('h2.cmp-title__text')) {
      sectionIndexes.push(i);
    }
  }
  // Return if none found (no accordion sections)
  if (sectionIndexes.length === 0) {
    return;
  }

  // Always use this header row
  const rows = [['Accordion (accordion32)']];
  // For each accordion section
  for (let idx = 0; idx < sectionIndexes.length; idx++) {
    const start = sectionIndexes[idx];
    const end = sectionIndexes[idx + 1] !== undefined ? sectionIndexes[idx + 1] : allNodes.length;

    // Accordion title cell: reference h2 element
    const titleEl = allNodes[start].querySelector('h2.cmp-title__text');
    const titleCell = titleEl;

    // Accordion content cell: everything between titles
    // Also, for the first section, collect content before the first h2
    let sectionContent = [];
    if (idx === 0 && start > 0) {
      for (let j = 0; j < start; j++) {
        const n = allNodes[j];
        // For text nodes, wrap in <p>
        if (n.nodeType === 3) {
          const p = document.createElement('p');
          p.textContent = n.textContent;
          sectionContent.push(p);
        } else {
          sectionContent.push(n);
        }
      }
    }
    // Now collect everything after the h2 until the next title
    for (let j = start + 1; j < end; j++) {
      const n = allNodes[j];
      if (n.nodeType === 3) {
        // For text nodes, wrap in <p>
        const p = document.createElement('p');
        p.textContent = n.textContent;
        sectionContent.push(p);
      } else if (
        n.nodeType === 1 &&
        n.classList.contains('aem-Grid') &&
        n.children.length > 0
      ) {
        // Unwrap grid children directly into the section
        sectionContent.push(...Array.from(n.children));
      } else {
        sectionContent.push(n);
      }
    }
    // Remove empty <p> or whitespace entries
    sectionContent = sectionContent.filter(n => {
      if (!n) return false;
      if (n.nodeType === 3) return n.textContent.trim();
      if (n.nodeType === 1 && n.tagName === 'P') return n.textContent.trim();
      return true;
    });
    // If one element, just use it; otherwise, list
    const contentCell = sectionContent.length === 0 ? '' : (sectionContent.length === 1 ? sectionContent[0] : sectionContent);
    rows.push([titleCell, contentCell]);
  }

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
