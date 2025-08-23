/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header matches the example
  const headerRow = ['Carousel (carousel27)'];

  // 2. Extract image for the first cell (reference existing <img>)
  let imageEl = null;
  const imageContainer = element.querySelector('.cmp-teaser__image');
  if (imageContainer) {
    imageEl = imageContainer.querySelector('img');
  }

  // 3. Extract text content for the second cell
  const cellContent = [];
  const contentContainer = element.querySelector('.cmp-teaser__content');
  if (contentContainer) {
    // Title: use heading as-is
    const title = contentContainer.querySelector('.cmp-teaser__title');
    if (title) {
      cellContent.push(title);
    }
    // Description: use as-is
    const desc = contentContainer.querySelector('.cmp-teaser__description');
    if (desc) {
      cellContent.push(desc);
    }
    // CTA link: use as-is
    const actionLink = contentContainer.querySelector('.cmp-teaser__action-link');
    if (actionLink) {
      cellContent.push(actionLink);
    }
  }

  // 4. Compose table rows and create table
  const slideRow = [imageEl, cellContent];
  const cells = [headerRow, slideRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // 5. Replace original element with block table
  element.replaceWith(block);
}
