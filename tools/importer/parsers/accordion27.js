/* global WebImporter */
export default function parse(element, { document }) {
  // Find the contentfragment block that contains the main accordion content
  let contentBlock = element.querySelector('.contentfragment');
  if (!contentBlock) {
    contentBlock = element;
  }

  // Find the content elements container
  let cfElements = contentBlock.querySelector('.cmp-contentfragment__elements');
  if (!cfElements) {
    cfElements = contentBlock;
  }

  // Get all h2 headings which will serve as accordion titles
  const headings = Array.from(cfElements.querySelectorAll('h2'));
  const rows = [];

  // Get all nodes before the first h2 as the intro (if any)
  if (headings.length > 0) {
    const firstH2 = headings[0];
    const introNodes = [];
    let node = firstH2.previousSibling;
    while (node) {
      if (node.nodeType === 1 || (node.nodeType === 3 && node.textContent.trim())) {
        introNodes.unshift(node);
      }
      node = node.previousSibling;
    }
    if (introNodes.length > 0) {
      // Only one cell for intro row: [introContent, '']
      rows.push(['', introNodes.length === 1 ? introNodes[0] : introNodes]);
    }
  }

  // For each h2, find all siblings up to next h2 (or end) as the content
  headings.forEach((h2) => {
    const contentNodes = [];
    let node = h2.nextSibling;
    while (node && !(node.nodeType === 1 && node.tagName.toLowerCase() === 'h2')) {
      if (node.nodeType === 1 || (node.nodeType === 3 && node.textContent.trim())) {
        contentNodes.push(node);
      }
      node = node.nextSibling;
    }
    let contentCell;
    if (contentNodes.length === 1) {
      contentCell = contentNodes[0];
    } else if (contentNodes.length > 1) {
      contentCell = contentNodes;
    } else {
      contentCell = '';
    }
    rows.push([h2, contentCell]);
  });

  // The header row is always a single column named exactly as the example
  const cells = [
    ['Accordion (accordion27)'],
    ...rows
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
