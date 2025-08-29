/* global WebImporter */
export default function parse(element, { document }) {
  // The header row must be a single column and match exactly
  const headerRow = ['Columns (columns40)'];

  // The rest of the table should have two columns for the image and content
  // Extract image element from teaser
  let imageCell = null;
  const teaserImageDiv = element.querySelector('.cmp-teaser__image');
  if (teaserImageDiv) {
    const img = teaserImageDiv.querySelector('img');
    if (img) {
      imageCell = img;
    } else {
      imageCell = '';
    }
  } else {
    imageCell = '';
  }

  // Extract content for the right cell
  let contentCell = '';
  const teaserContent = element.querySelector('.cmp-teaser__content');
  if (teaserContent) {
    // Reference all children as a block
    const contentDiv = document.createElement('div');
    Array.from(teaserContent.childNodes).forEach(n => contentDiv.appendChild(n));
    contentCell = contentDiv;
  }

  // Compose table: header is one column, content rows have two columns
  const cells = [
    headerRow,          // header: 1 column
    [imageCell, contentCell] // content: 2 columns
  ];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
