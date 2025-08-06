/* global WebImporter */
export default function parse(element, { document }) {
  // Find the teaser block (direct child with class 'cmp-teaser')
  const teaser = element.querySelector('.cmp-teaser');
  if (!teaser) return;

  // Get the image (should be the first img inside .cmp-teaser__image)
  let imgEl = null;
  const imageWrapper = teaser.querySelector('.cmp-teaser__image');
  if (imageWrapper) {
    imgEl = imageWrapper.querySelector('img');
  }

  // Compose the text content for the right cell
  const textCell = [];
  const content = teaser.querySelector('.cmp-teaser__content');
  if (content) {
    // Keep pretitle if present
    const pretitle = content.querySelector('.cmp-teaser__pretitle');
    if (pretitle && pretitle.textContent.trim()) {
      textCell.push(pretitle);
    }
    // Heading (title)
    const title = content.querySelector('.cmp-teaser__title');
    if (title && title.textContent.trim()) {
      textCell.push(title);
    }
    // Description
    const desc = content.querySelector('.cmp-teaser__description');
    if (desc && desc.textContent.trim()) {
      textCell.push(desc);
    }
    // CTA (if present)
    const action = content.querySelector('.cmp-teaser__action-link');
    if (action) {
      textCell.push(action);
    }
  }

  // Build table with a single-cell header row, and a two-cell content row
  const cells = [
    ['Carousel (carousel40)'],
    [imgEl ? imgEl : '', textCell.length > 0 ? textCell : '']
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
