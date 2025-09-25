/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row
  const headerRow = ['Hero (hero39)'];

  // 2. Background image row - must be a background image, so use image src as a string
  let bgImgSrc = '';
  const teaserImageDiv = element.querySelector('.cmp-teaser__image');
  if (teaserImageDiv) {
    const img = teaserImageDiv.querySelector('img');
    if (img && img.src) bgImgSrc = img.src;
  }

  // 3. Content row: include all text content from the source html
  const contentDiv = element.querySelector('.cmp-teaser__content');
  let contentCell = '';
  if (contentDiv) {
    // Instead of pushing only specific elements, include all content as HTML
    contentCell = contentDiv.innerHTML;
  }

  // Compose table rows
  const rows = [
    headerRow,
    [bgImgSrc],
    [contentCell],
  ];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(table);
}
