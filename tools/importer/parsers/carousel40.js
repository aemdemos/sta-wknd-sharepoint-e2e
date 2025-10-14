/* global WebImporter */
export default function parse(element, { document }) {
  // Carousel block header row
  const headerRow = ['Carousel (carousel40)'];

  // Defensive: Find the main teaser block (could be the element itself or a child)
  let teaser = element;
  if (!teaser.classList.contains('cmp-teaser')) {
    teaser = element.querySelector('.cmp-teaser');
  }
  if (!teaser) return;

  // Find image (first column)
  let imageEl = null;
  const imageContainer = teaser.querySelector('.cmp-teaser__image');
  if (imageContainer) {
    imageEl = imageContainer.querySelector('img');
  }

  // Find text content (second column)
  const contentContainer = teaser.querySelector('.cmp-teaser__content');
  const textContent = [];
  if (contentContainer) {
    // Pretitle (optional)
    const pretitle = contentContainer.querySelector('.cmp-teaser__pretitle');
    if (pretitle) textContent.push(pretitle);
    // Title (h2)
    const title = contentContainer.querySelector('.cmp-teaser__title');
    if (title) textContent.push(title);
    // Description
    const desc = contentContainer.querySelector('.cmp-teaser__description');
    if (desc) textContent.push(desc);
    // CTA link
    const actionContainer = contentContainer.querySelector('.cmp-teaser__action-container');
    if (actionContainer) {
      const cta = actionContainer.querySelector('a');
      if (cta) textContent.push(cta);
    }
  }

  // Compose the slide row: image in first cell, text in second cell
  const slideRow = [imageEl, textContent];

  // Build the table
  const cells = [headerRow, slideRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element with the block table
  element.replaceWith(block);
}
