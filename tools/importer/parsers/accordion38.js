/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cmp-contentfragment (the main article block)
  const cf = element.querySelector('article.cmp-contentfragment');
  if (!cf) return;

  // Find the content container that holds all possible accordion sections
  const contentRoot = cf.querySelector('.cmp-contentfragment__elements');
  if (!contentRoot) return;

  // Get all nodes (including elements and text nodes)
  const allNodes = Array.from(contentRoot.childNodes).filter((n) => {
    // Keep elements and non-empty text nodes
    if (n.nodeType === Node.TEXT_NODE) return n.textContent.trim() !== '';
    return true;
  });

  // Find the indices in allNodes where an h2.cmp-title__text appears (section header)
  const sectionIndices = [];
  allNodes.forEach((node, idx) => {
    if (node.nodeType === Node.ELEMENT_NODE && node.querySelector && node.querySelector('h2.cmp-title__text')) {
      sectionIndices.push(idx);
    }
  });

  if (sectionIndices.length === 0) return;

  // Build the accordion block rows
  const rows = [['Accordion (accordion38)']];

  for (let i = 0; i < sectionIndices.length; i++) {
    const idxStart = sectionIndices[i];
    const idxEnd = (i + 1 < sectionIndices.length) ? sectionIndices[i + 1] : allNodes.length;

    // Title: the h2 node itself
    const h2 = allNodes[idxStart].querySelector('h2.cmp-title__text');
    // Content: everything between this h2 and the next h2, as array of elements/nodes
    const contentNodes = [];
    for (let j = idxStart + 1; j < idxEnd; j++) {
      const node = allNodes[j];
      // Only push if element or non-empty text
      if (node.nodeType === Node.ELEMENT_NODE || (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== '')) {
        contentNodes.push(node);
      }
    }
    rows.push([h2, contentNodes]);
  }

  // Create the accordion block table and replace the original cf
  const block = WebImporter.DOMUtils.createTable(rows, document);
  cf.replaceWith(block);
}
