/* global WebImporter */
export default function parse(element, { document }) {
  // The header row for the block
  const headerRow = ['Accordion (accordion19)'];
  const cells = [headerRow];

  // Find the main contentfragment article (contains the core accordion content)
  const contentFragment = element.querySelector('article.cmp-contentfragment, article.contentfragment');
  if (!contentFragment) {
    // If not present, do not process
    return;
  }
  // Get all h2s inside the contentfragment (these are accordion titles)
  const titleEls = contentFragment.querySelectorAll('h2');
  // For each accordion section
  titleEls.forEach((h2, i) => {
    // The title cell is the h2 element itself
    const titleCell = h2;
    // To get the body cell: collect all siblings after h2 until next h2 (or end of fragment)
    let bodyNodes = [];
    // We want to start after h2's parent (usually <div.cmp-title> or direct parent)
    let parent = h2.parentElement;
    let node = parent.nextSibling;
    while (node) {
      // If we reach another section title, break
      if (node.nodeType === 1 && node.querySelector && node.querySelector('h2')) break;
      // If it's another title block
      if (node.nodeType === 1 && node.matches && node.matches('.cmp-title')) {
        if (node.querySelector('h2')) break;
      }
      // If it's a h2 itself
      if (node.nodeType === 1 && node.tagName === 'H2') break;
      // Add non-empty nodes only
      if ((node.nodeType === 1 || node.nodeType === 3) && !(node.nodeType === 3 && node.textContent.trim() === '')) {
        bodyNodes.push(node);
      }
      node = node.nextSibling;
    }
    // If the body is empty, try to look for next content between h2's parent and next h2
    if (bodyNodes.length === 0) {
      // Try next siblings of h2's parent
      node = parent.nextSibling;
      while (node) {
        if (node.nodeType === 1 && node.querySelector && node.querySelector('h2')) break;
        if (node.nodeType === 1 && node.matches && node.matches('.cmp-title')) {
          if (node.querySelector('h2')) break;
        }
        if (node.nodeType === 1 && node.tagName === 'H2') break;
        if ((node.nodeType === 1 || node.nodeType === 3) && !(node.nodeType === 3 && node.textContent.trim() === '')) {
          bodyNodes.push(node);
        }
        node = node.nextSibling;
      }
    }
    // If still empty, look for immediate next siblings of h2
    if (bodyNodes.length === 0) {
      node = h2.nextSibling;
      while (node) {
        if (node.nodeType === 1 && node.tagName === 'H2') break;
        if ((node.nodeType === 1 || node.nodeType === 3) && !(node.nodeType === 3 && node.textContent.trim() === '')) {
          bodyNodes.push(node);
        }
        node = node.nextSibling;
      }
    }
    // Remove any blank divs/grids
    bodyNodes = bodyNodes.filter(n => {
      if (n.nodeType === 1 && n.classList && n.classList.contains('aem-Grid')) {
        return n.children.length > 0;
      }
      return true;
    });
    // If bodyNodes is 0, skip row
    if (bodyNodes.length === 0) return;
    // If only one node, pass direct, else pass as array
    const bodyCell = bodyNodes.length === 1 ? bodyNodes[0] : bodyNodes;
    cells.push([titleCell, bodyCell]);
  });

  // Only replace if there are rows
  if (cells.length > 1) {
    const table = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(table);
  }
}
