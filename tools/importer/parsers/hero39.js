/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: get the main teaser element (may be nested)
  const teaser = element.querySelector('.cmp-teaser') || element;

  // Get image element for row 2
  let img = null;
  const imageContainer = teaser.querySelector('.cmp-teaser__image');
  if (imageContainer) {
    img = imageContainer.querySelector('img');
  }

  // Get title and description for row 3
  let title = null;
  let description = null;
  const content = teaser.querySelector('.cmp-teaser__content');
  if (content) {
    title = content.querySelector('.cmp-teaser__title');
    description = content.querySelector('.cmp-teaser__description');
  }

  // Compose row 3: title (h2) and description (div with p)
  const textElements = [];
  if (title) textElements.push(title);
  if (description) textElements.push(description);

  // Table rows
  const headerRow = ['Hero (hero39)'];
  const imageRow = [img ? img : ''];
  const contentRow = [textElements.length ? textElements : ''];

  // Create block table
  const cells = [
    headerRow,
    imageRow,
    contentRow
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element with block
  element.replaceWith(block);
}
