/* global WebImporter */
export default function parse(element, { document }) {
  // Find all direct child containers that represent columns (main content and sidebar)
  const columns = [];
  // Select all direct children that are either <main.container> or <aside.container>
  element.querySelectorAll(':scope > main.container, :scope > aside.container').forEach(col => {
    const wrapper = document.createElement('div');
    while (col.firstChild) wrapper.appendChild(col.firstChild);
    columns.push(wrapper);
  });
  if (!columns.length) return;

  // Header row: a single cell as in the example
  const cells = [
    ['Columns'],
    columns
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
