/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main contentfragment content root
  const cf = element.querySelector('.contentfragment .cmp-contentfragment__elements > div');
  if (!cf) return;

  // Compose accordion rows: each h2 is a title, content is all following siblings until next h2
  const rows = [];
  const headerRow = ['Accordion (accordion16)'];
  rows.push(headerRow);

  let node = cf.firstElementChild;
  while (node) {
    if (node.tagName && node.tagName.toLowerCase() === 'h2') {
      const title = node.textContent.trim();
      const contentNodes = [];
      let contentNode = node.nextElementSibling;
      while (contentNode && !(contentNode.tagName && contentNode.tagName.toLowerCase() === 'h2')) {
        // Accept any element except h2 as content
        // For images, include the .cmp-image wrapper if present
        if (contentNode.tagName) {
          if (contentNode.classList.contains('aem-Grid')) {
            // Dive into grid columns for images
            const imgCol = contentNode.querySelector('.cmp-image');
            if (imgCol) {
              contentNodes.push(imgCol.cloneNode(true));
            }
          } else if (contentNode.querySelector && contentNode.querySelector('.cmp-image')) {
            contentNodes.push(contentNode.querySelector('.cmp-image').cloneNode(true));
          } else if (contentNode.tagName.toLowerCase() === 'p' && contentNode.textContent.trim()) {
            contentNodes.push(contentNode.cloneNode(true));
          }
        }
        contentNode = contentNode.nextElementSibling;
      }
      // Always add a row for each h2, even if content is empty
      rows.push([
        title,
        contentNodes.length === 1 ? contentNodes[0] : (contentNodes.length > 1 ? contentNodes : '')
      ]);
      node = contentNode;
    } else {
      node = node.nextElementSibling;
    }
  }

  // Always output the table, even if only header (block marker) present
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
