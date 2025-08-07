/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-teaser block if present
  const teaser = element.querySelector('.cmp-teaser') || element;

  // Get the image element inside the teaser
  let img = null;
  const imageContainer = teaser.querySelector('.cmp-teaser__image');
  if (imageContainer) {
    img = imageContainer.querySelector('img');
  } else {
    img = teaser.querySelector('img');
  }

  // Get the content container
  const contentContainer = teaser.querySelector('.cmp-teaser__content') || teaser;
  // Compose text content array
  const textCellContent = [];
  const title = contentContainer.querySelector('.cmp-teaser__title');
  if (title) textCellContent.push(title);
  const desc = contentContainer.querySelector('.cmp-teaser__description');
  if (desc) textCellContent.push(desc);
  const cta = contentContainer.querySelector('.cmp-teaser__action-link');
  if (cta) textCellContent.push(cta);

  // Handle edge case: if all text content is missing, cell should be empty string
  const textCell = textCellContent.length ? textCellContent : '';

  // Compose the table rows
  const cells = [
    ['Carousel (carousel27)'],
    [img || '', textCell]
  ];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
