/* global WebImporter */
export default function parse(element, { document }) {
  // Compose a 2-column accordion block table matching the spec
  // The header must be ['Accordion (accordion9)']

  const rows = [];
  // Header
  rows.push(['Accordion (accordion9)']);

  // Find all accordion items: each is a pair of sibling elements (title cell, content cell)
  // For the example, children may be simple or contain multiple nodes per cell
  // We'll iterate immediate children and group them in pairs

  // Get all direct child nodes (element nodes only)
  const children = Array.from(element.children).filter(e => e.nodeType === 1);

  for (let i = 0; i < children.length; ) {
    // Find the next block of adjacent children that are grouped as a single accordion row
    // Typical structure: [div/or other] (title cell), then [div/or other] (content cell)
    // Sometimes content cell may have multiple elements
    const titleEl = children[i];
    let contentEl = null;
    let contentCells = [];

    // Look ahead for the content cell: either next sibling or group of siblings until next probable title
    if (i + 1 < children.length) {
      // If title is a heading (h2/h3/h4/h5/h6/strong), content is next sibling until next heading or end
      if (/^(H[2-6]|STRONG)$/i.test(titleEl.tagName)) {
        let j = i + 1;
        while (
          j < children.length &&
          !/^(H[2-6]|STRONG)$/i.test(children[j].tagName)
        ) {
          contentCells.push(children[j]);
          j++;
        }
        // If no content, provide an empty string
        if (contentCells.length === 0) contentCells = [''];
        rows.push([titleEl, contentCells.length === 1 ? contentCells[0] : contentCells]);
        i = j;
        continue;
      } else {
        // Generic two-column (pair) grouping
        contentEl = children[i + 1];
        rows.push([titleEl, contentEl]);
        i = i + 2;
        continue;
      }
    } else {
      // If last element, treat as single title cell with empty content
      rows.push([titleEl, '']);
      i = i + 1;
    }
  }

  // If there is only the header row (no items), do nothing
  if (rows.length === 1) return;

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
