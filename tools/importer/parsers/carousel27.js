/* global WebImporter */
export default function parse(element, { document }) {
  // The block header must match exactly
  const headerRow = ['Carousel (carousel27)'];

  // Extract image for first cell
  let imgEl = null;
  const imageContainer = element.querySelector('.cmp-teaser__image');
  if (imageContainer) {
    imgEl = imageContainer.querySelector('img');
  }

  // Extract text content for second cell
  const content = element.querySelector('.cmp-teaser__content');
  const textFragments = [];
  if (content) {
    // Title as heading
    const title = content.querySelector('.cmp-teaser__title');
    if (title && title.textContent.trim()) {
      const h2 = document.createElement('h2');
      h2.textContent = title.textContent.trim();
      textFragments.push(h2);
    }
    // Description
    const desc = content.querySelector('.cmp-teaser__description');
    if (desc && desc.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = desc.textContent.trim();
      textFragments.push(p);
    }
    // CTA (if exists)
    const cta = content.querySelector('.cmp-teaser__action-link');
    if (cta) {
      textFragments.push(cta);
    }
  }

  // Put together the row for this slide
  const row = [imgEl, textFragments];
  // Compose the cells array as in the example: header row + content row(s)
  const cells = [headerRow, row];

  // Create and replace the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
