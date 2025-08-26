/* global WebImporter */
export default function parse(element, { document }) {
  // The header row for the accordion block
  const headerRow = ['Accordion (accordion13)'];

  // Each accordion item should be a row with 2 columns: left is title/label, right is content
  // Each item: <div>title content</div><div>body content</div>
  // So find all immediate pairs of divs (siblings)
  // Most robust: iterate through children and group consecutive pairs

  const rows = [];
  // Select only immediate div children
  const childDivs = Array.from(element.querySelectorAll(':scope > div'));

  // Group consecutive pairs of divs as [titleDiv, contentDiv]
  for (let i = 0; i < childDivs.length - 1; i += 2) {
    const titleDiv = childDivs[i];
    const contentDiv = childDivs[i + 1];
    rows.push([titleDiv, contentDiv]);
  }

  // If there are odd divs, ignore the last one (cannot form a pair)

  // Compose the cells for the table: header + accordion item rows
  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
