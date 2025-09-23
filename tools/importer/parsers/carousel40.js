/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the main teaser block
  const teaser = element.querySelector('.cmp-teaser');
  if (!teaser) return;

  // Get image element (mandatory)
  let img = null;
  const imageWrapper = teaser.querySelector('.cmp-teaser__image');
  if (imageWrapper) {
    img = imageWrapper.querySelector('img');
  }

  // Get text content elements (optional)
  const content = teaser.querySelector('.cmp-teaser__content');
  let textContent = [];
  if (content) {
    // Pretitle (optional)
    const pretitle = content.querySelector('.cmp-teaser__pretitle');
    if (pretitle) textContent.push(pretitle);
    // Title (optional)
    const title = content.querySelector('.cmp-teaser__title');
    if (title) textContent.push(title);
    // Description (optional)
    const desc = content.querySelector('.cmp-teaser__description');
    if (desc) textContent.push(desc);
    // CTA (optional)
    const action = content.querySelector('.cmp-teaser__action-link');
    if (action) textContent.push(action);
  }

  // Compose table rows
  const headerRow = ['Carousel (carousel40)'];
  const rows = [headerRow];

  // Defensive: only add row if we have an image
  if (img) {
    rows.push([
      img,
      textContent.length ? textContent : ''
    ]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace original element
  element.replaceWith(block);
}
