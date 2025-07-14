/* global WebImporter */
export default function parse(element, { document }) {
  // Ensure we have a header row that matches the example exactly
  const headerRow = ['Columns (columns7)'];
  const rows = [headerRow];

  // The main content is the left/article column
  const mainContent = element.querySelector('main.container.responsivegrid .cmp-container');
  // The sidebar is the right/aside column
  const sidebar = element.querySelector('aside.container.responsivegrid .cmp-container');

  // Helper: flatten all direct children, including text nodes
  function collectContent(parent) {
    if (!parent) return [];
    const nodes = [];
    for (let child of parent.childNodes) {
      if (child.nodeType === Node.ELEMENT_NODE) {
        nodes.push(child);
      } else if (child.nodeType === Node.TEXT_NODE && child.textContent.trim()) {
        // Wrap text nodes in <span> to preserve them
        const span = document.createElement('span');
        span.textContent = child.textContent;
        nodes.push(span);
      }
    }
    return nodes;
  }

  // Left column: insert all children from the article container
  let leftContent = collectContent(mainContent);
  // Right column: insert all children from the sidebar container
  let rightContent = collectContent(sidebar);

  // Both columns must have something. Use '' if nothing.
  if (!leftContent.length) leftContent = [''];
  if (!rightContent.length) rightContent = [''];

  // Add the columns row, referencing the actual DOM nodes
  rows.push([
    leftContent,
    rightContent
  ]);

  // Replace the original element with the table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
