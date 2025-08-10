/* global WebImporter */
export default function parse(element, { document }) {
  // Carousel40 block header as in example
  const headerRow = ['Carousel (carousel40)'];

  // Prepare image cell: find the main img in the teaser
  let imageCell = '';
  const imgContainer = element.querySelector('.cmp-teaser__image');
  if (imgContainer) {
    const img = imgContainer.querySelector('img');
    if (img) imageCell = img;
  }

  // Prepare content cell: collect all relevant elements in source order
  const contentCellItems = [];

  // Pretitle
  const pretitle = element.querySelector('.cmp-teaser__pretitle');
  if (pretitle && pretitle.textContent.trim()) {
    contentCellItems.push(pretitle);
  }
  // Title (keep heading element)
  const title = element.querySelector('.cmp-teaser__title');
  if (title && title.textContent.trim()) {
    contentCellItems.push(title);
  }
  // Description
  const desc = element.querySelector('.cmp-teaser__description');
  if (desc && desc.textContent.trim()) {
    contentCellItems.push(desc);
  }
  // CTA (anchor)
  const cta = element.querySelector('.cmp-teaser__action-link');
  if (cta && cta.textContent.trim()) {
    contentCellItems.push(cta);
  }

  // Each slide is a row with [image, [content...]]
  const rows = [headerRow, [imageCell, contentCellItems]];

  // Create the carousel block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element with the block
  element.replaceWith(table);
}
