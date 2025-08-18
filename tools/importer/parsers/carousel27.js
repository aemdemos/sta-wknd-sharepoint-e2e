/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header must exactly match the example
  const headerRow = ['Carousel (carousel27)'];

  // 2. Collect slide data (image, text content, CTA)
  // The image is always in .cmp-teaser__image, the content is in .cmp-teaser__content
  let img = null;
  const imageDiv = element.querySelector('.cmp-teaser__image');
  if (imageDiv) {
    img = imageDiv.querySelector('img');
  }
  // If no image, use null (empty cell)

  // Text content cell: includes title (h2), description and CTA (if present)
  const contentDiv = element.querySelector('.cmp-teaser__content');
  const textContent = [];
  if (contentDiv) {
    // Title (h2 or similar)
    const title = contentDiv.querySelector('.cmp-teaser__title');
    if (title) {
      textContent.push(title);
    }
    // Description (div)
    const desc = contentDiv.querySelector('.cmp-teaser__description');
    if (desc) {
      textContent.push(desc);
    }
    // CTA (a)
    const cta = contentDiv.querySelector('.cmp-teaser__action-link');
    if (cta) {
      textContent.push(cta);
    }
  }
  // If no text content, cell will be empty array

  // Each slide is a row: [img, [title, desc, cta]]
  const slideRow = [img, textContent];

  // 3. Build table
  // The example only has 1 table, no Section Metadata
  const cells = [headerRow, slideRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // 4. Replace element
  element.replaceWith(block);
}
