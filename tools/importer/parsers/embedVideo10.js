/* global WebImporter */
export default function parse(element, { document }) {
  // Find the 'cmp-text' block for the copyright/footer text
  const text = element.querySelector('.cmp-text');
  if (!text) return;
  // Build the Embed table
  const headerRow = ['Embed'];
  const contentRow = [text];
  const table = WebImporter.DOMUtils.createTable([headerRow, contentRow], document);
  element.replaceWith(table);
}