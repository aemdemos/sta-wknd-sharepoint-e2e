/* global WebImporter */
export default function parse(element, { document }) {
  // Extract the content and image containers
  const teaserContent = element.querySelector('.cmp-teaser__content');
  const teaserImage = element.querySelector('.cmp-teaser__image');

  // Create content div for first column
  const contentDiv = document.createElement('div');
  if (teaserContent) {
    Array.from(teaserContent.childNodes).forEach(child => {
      if (child.nodeType === Node.ELEMENT_NODE || (child.nodeType === Node.TEXT_NODE && child.textContent.trim())) {
        contentDiv.appendChild(child);
      }
    });
  }

  // Second column is the image block
  let imageBlock = null;
  if (teaserImage) {
    imageBlock = teaserImage;
  }

  // Header row: single column with the block name
  const headerRow = ['Columns (columns40)'];
  // Data row: two columns, content and image
  const dataRow = [[contentDiv, imageBlock]];

  // Build the cells array: header is one cell, data row is array of two cells
  const cells = [headerRow, ...dataRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}