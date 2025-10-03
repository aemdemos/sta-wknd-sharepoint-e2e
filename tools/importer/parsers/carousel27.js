/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the teaser block (could be the element itself or its child)
  let teaser = element;
  if (!teaser.classList.contains('cmp-teaser')) {
    teaser = element.querySelector('.cmp-teaser');
  }
  if (!teaser) return;

  // Get image (first column)
  let imageEl;
  const imageContainer = teaser.querySelector('.cmp-teaser__image');
  if (imageContainer) {
    imageEl = imageContainer.querySelector('img');
  }

  // Get content (second column)
  const contentContainer = teaser.querySelector('.cmp-teaser__content');
  let titleEl = null;
  let descEl = null;
  let ctaEl = null;
  if (contentContainer) {
    titleEl = contentContainer.querySelector('.cmp-teaser__title');
    descEl = contentContainer.querySelector('.cmp-teaser__description');
    ctaEl = contentContainer.querySelector('.cmp-teaser__action-link');
  }

  // Compose text cell
  const textCell = [];
  if (titleEl) textCell.push(titleEl);
  if (descEl) textCell.push(descEl);
  if (ctaEl) textCell.push(ctaEl);

  // Build table rows
  const headerRow = ['Carousel (carousel27)'];
  const slideRow = [imageEl, textCell];
  const rows = [headerRow, slideRow];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace original element
  element.replaceWith(block);
}
