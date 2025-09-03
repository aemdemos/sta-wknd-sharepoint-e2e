/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main contentfragment article
  const contentFragment = element.querySelector('.contentfragment .cmp-contentfragment');
  if (!contentFragment) return;

  // Find all h2 titles (accordion section headers)
  const h2s = Array.from(contentFragment.querySelectorAll('h2.cmp-title__text'));
  if (h2s.length === 0) return;

  // Build rows for each accordion section
  const rows = [];
  h2s.forEach((h2, idx) => {
    // Title cell
    const titleCell = h2.textContent.trim();
    // Content cell: gather all nodes between this h2 and the next h2
    let contentNodes = [];
    let node = h2.parentElement.parentElement.parentElement.nextElementSibling;
    while (node && !node.querySelector?.('h2.cmp-title__text')) {
      // If this is a div with images or text, include all its children
      if (node.tagName === 'DIV' && node.children.length > 0) {
        contentNodes.push(...node.children);
      } else {
        contentNodes.push(node);
      }
      node = node.nextElementSibling;
    }
    // Remove empty nodes
    contentNodes = contentNodes.filter(n => n && (n.nodeType !== Node.TEXT_NODE || n.textContent.trim() !== ''));
    // If nothing found, fallback to next paragraph after h2
    if (contentNodes.length === 0) {
      let fallback = h2.parentElement.parentElement.parentElement.nextElementSibling;
      if (fallback && fallback.tagName === 'P') {
        contentNodes = [fallback];
      }
    }
    // If still nothing, skip
    if (contentNodes.length === 0) return;
    rows.push([titleCell, contentNodes.length === 1 ? contentNodes[0] : contentNodes]);
  });

  if (rows.length > 0) {
    const headerRow = ['Accordion (accordion32)'];
    const cells = [headerRow, ...rows];
    const table = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(table);
  }
}
