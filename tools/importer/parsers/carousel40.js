/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the main teaser block (could be the element itself or a child)
  let teaser = element;
  if (!teaser.classList.contains('cmp-teaser')) {
    teaser = element.querySelector('.cmp-teaser');
    if (!teaser) return;
  }

  // Find image (first cell)
  let imageCell = '';
  const imageWrapper = teaser.querySelector('.cmp-teaser__image');
  if (imageWrapper) {
    // Find the actual <img> inside
    const img = imageWrapper.querySelector('img');
    if (img) {
      imageCell = img;
    }
  }

  // Find text content (second cell)
  const textContent = document.createElement('div');
  // Pretitle (optional)
  const pretitle = teaser.querySelector('.cmp-teaser__pretitle');
  if (pretitle) {
    textContent.appendChild(pretitle);
  }
  // Title (h2)
  const title = teaser.querySelector('.cmp-teaser__title');
  if (title) {
    textContent.appendChild(title);
  }
  // Description
  const desc = teaser.querySelector('.cmp-teaser__description');
  if (desc) {
    textContent.appendChild(desc);
  }
  // CTA (optional)
  const cta = teaser.querySelector('.cmp-teaser__action-link');
  if (cta) {
    textContent.appendChild(cta);
  }

  // Build the table rows
  const headerRow = ['Carousel (carousel40)'];
  const slideRow = [imageCell, textContent];
  const cells = [headerRow, slideRow];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
