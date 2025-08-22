/* global WebImporter */
export default function parse(element, { document }) {
  // Compose the block table, starting with the header
  const rows = [['Accordion (accordion11)']];

  // Find the main article/content area where accordion items live.
  // For WKND, these are inside the .cmp-contentfragment__elements area, or fall back to the element itself.
  const contentFragment = element.querySelector('.cmp-contentfragment__elements') || element;

  // The actual accordion items start at the FIRST h2 INSIDE .cmp-contentfragment__elements,
  // and each accordion item is: <h2> + all siblings until the next <h2>

  // Get all direct children in .cmp-contentfragment__elements
  const children = Array.from(contentFragment.children);
  let i = 0;
  while (i < children.length) {
    const node = children[i];
    // Only consider h2s as accordion titles
    if (node.tagName === 'H2') {
      const titleElem = node;
      const contentNodes = [];
      i++;
      // Collect all subsequent siblings until next h2 or end
      while (i < children.length && children[i].tagName !== 'H2') {
        contentNodes.push(children[i]);
        i++;
      }
      // Compose content cell
      let contentCell;
      if (contentNodes.length === 1) {
        contentCell = contentNodes[0];
      } else if (contentNodes.length > 1) {
        contentCell = document.createElement('div');
        contentNodes.forEach(n => contentCell.appendChild(n));
      } else {
        contentCell = document.createElement('div');
      }
      rows.push([titleElem, contentCell]);
    } else {
      // Skip any leading non-h2 elements
      i++;
    }
  }

  // Only create the accordion if there's at least one item
  if (rows.length > 1) {
    const table = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(table);
  }
}
