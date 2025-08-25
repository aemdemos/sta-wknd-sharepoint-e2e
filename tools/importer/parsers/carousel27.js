/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header must match exactly from the instructions
  const headerRow = ['Carousel (carousel27)'];

  // 2. Extract the image from the teaser
  let img = element.querySelector('.cmp-teaser__image img');
  // If no image found, insert an empty cell as per guidelines
  let imgCell = img ? img : '';

  // 3. Compose content cell: Title (h2), Description, CTA
  const contentCell = [];
  // Title
  const title = element.querySelector('.cmp-teaser__title');
  if (title) contentCell.push(title);
  // Description
  const desc = element.querySelector('.cmp-teaser__description');
  if (desc) contentCell.push(desc);
  // CTA link
  const cta = element.querySelector('.cmp-teaser__action-link');
  if (cta) contentCell.push(cta);

  // 4. Compose rows: header and slide
  const rows = [headerRow, [imgCell, contentCell.length ? contentCell : '']];

  // 5. Create the block table using the WebImporter helper
  const blockTable = WebImporter.DOMUtils.createTable(rows, document);

  // 6. Replace the original element with the block table
  element.replaceWith(blockTable);
}
