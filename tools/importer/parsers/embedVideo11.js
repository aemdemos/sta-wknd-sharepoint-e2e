/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: ensure element exists
  if (!element) return;
  // Find the cmp-text block
  const textDiv = element.querySelector('.cmp-text');
  if (!textDiv) return;
  // Embed block table: header = Embed
  const cells = [
    ['Embed'],
    [textDiv]
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}