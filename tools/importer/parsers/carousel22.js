/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get all carousel items
  const carouselContent = element.querySelector('.cmp-carousel__content');
  if (!carouselContent) return;

  // Get all direct child carousel items
  const items = Array.from(carouselContent.querySelectorAll(':scope > .cmp-carousel__item'));
  if (!items.length) return;

  // Table header row as required
  const headerRow = ['Carousel (carousel22)'];
  const rows = [headerRow];

  items.forEach((item) => {
    // Find teaser inside carousel item
    const teaser = item.querySelector('.cmp-teaser');

    // Defensive: If no teaser, skip
    if (!teaser) return;

    // --- IMAGE CELL ---
    // Find image element inside teaser
    let img = null;
    const teaserImageDiv = teaser.querySelector('.cmp-teaser__image');
    if (teaserImageDiv) {
      // Find the first <img> inside teaserImageDiv
      img = teaserImageDiv.querySelector('img');
    }
    // Defensive: If no image, cell is empty
    const imageCell = img ? img : '';

    // --- CONTENT CELL ---
    const contentParts = [];
    // Title (h2)
    const title = teaser.querySelector('.cmp-teaser__title');
    if (title) contentParts.push(title);
    // Description
    const desc = teaser.querySelector('.cmp-teaser__description');
    if (desc) contentParts.push(desc);
    // CTA link
    const cta = teaser.querySelector('.cmp-teaser__action-link');
    if (cta) contentParts.push(cta);
    // If nothing found, cell is empty
    const contentCell = contentParts.length ? contentParts : '';

    rows.push([imageCell, contentCell]);
  });

  // Create table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace original element
  element.replaceWith(block);
}
