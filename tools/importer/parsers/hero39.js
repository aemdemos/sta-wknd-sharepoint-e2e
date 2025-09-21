/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the target block name as the header row
  const headerRow = ['Hero (hero39)'];

  // Find the main teaser block
  const teaser = element.querySelector('.cmp-teaser');
  if (!teaser) return;

  // Find the background image (optional)
  let imageEl = '';
  const imageContainer = teaser.querySelector('.cmp-teaser__image img');
  if (imageContainer) {
    imageEl = imageContainer.cloneNode(true);
  }

  // Find the title and description
  const contentContainer = teaser.querySelector('.cmp-teaser__content');
  const contentArr = [];
  if (contentContainer) {
    const title = contentContainer.querySelector('.cmp-teaser__title');
    if (title) contentArr.push(title.cloneNode(true));
    const desc = contentContainer.querySelector('.cmp-teaser__description');
    if (desc) {
      Array.from(desc.children).forEach((node) => {
        contentArr.push(node.cloneNode(true));
      });
    }
  }

  // Combine all content into a single cell for the third row
  const thirdRowCell = document.createElement('div');
  contentArr.forEach((el) => thirdRowCell.appendChild(el));

  // Build the rows for the table (each row is a single cell array)
  const rows = [
    headerRow,
    [imageEl],
    [thirdRowCell],
  ];

  // Create and replace with the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
