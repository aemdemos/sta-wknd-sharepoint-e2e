/* global WebImporter */
export default function parse(element, { document }) {
  // The block header must match exactly
  const headerRow = ['Accordion (accordion17)'];

  // Helper function to flatten nodes for table cell
  function flattenNodes(nodes) {
    // If just one node, return it
    if (nodes.length === 1) return nodes[0];
    // If more than one node, return array
    return nodes;
  }

  // Find direct children of element
  const children = Array.from(element.children);

  // We'll look for h2 titles for accordion sections, and collect each one's content up to the next title or end
  // But skip any leading content before first h2.cmp-title__text
  const rows = [headerRow];

  let i = 0;
  while (i < children.length) {
    const child = children[i];
    // Check: Is it a title block with h2?
    const h2 = child.classList.contains('title') ? child.querySelector('h2.cmp-title__text') : null;
    if (h2) {
      // Found accordion item title
      // Gather all following siblings as content until next h2.cmp-title__text
      const contentNodes = [];
      let j = i + 1;
      while (j < children.length) {
        const nextChild = children[j];
        const nextIsTitle = nextChild.classList.contains('title') && nextChild.querySelector('h2.cmp-title__text');
        if (nextIsTitle) break;
        contentNodes.push(nextChild);
        j++;
      }
      // If no content nodes, use empty string as cell
      const contentCell = contentNodes.length ? flattenNodes(contentNodes) : '';
      rows.push([h2, contentCell]);
      i = j;
    } else {
      i++;
    }
  }

  // Only create the accordion block table if at least one item was found
  if (rows.length > 1) {
    const table = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(table);
  }
  // If no rows, do nothing
}
