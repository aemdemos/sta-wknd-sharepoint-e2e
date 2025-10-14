/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row for Carousel (carousel22)
  const headerRow = ['Carousel (carousel22)'];

  // Find the carousel content container
  const carouselContent = element.querySelector('.cmp-carousel__content');
  if (!carouselContent) return;

  // Find all carousel items (slides)
  const items = Array.from(carouselContent.querySelectorAll('.cmp-carousel__item'));

  // Prepare rows for each slide
  const rows = items.map((item) => {
    // Defensive: find teaser block inside the carousel item
    const teaser = item.querySelector('.cmp-teaser');
    if (!teaser) return [document.createElement('div'), document.createElement('div')];

    // --- IMAGE CELL ---
    // Find image element
    let imgEl = null;
    const teaserImage = teaser.querySelector('.cmp-teaser__image');
    if (teaserImage) {
      imgEl = teaserImage.querySelector('img');
    }
    // If not found, create empty cell
    const imageCell = imgEl ? imgEl : document.createElement('div');

    // --- CONTENT CELL ---
    const contentParts = [];
    // Title (h2)
    const titleEl = teaser.querySelector('.cmp-teaser__title');
    if (titleEl) {
      // Use heading element directly
      contentParts.push(titleEl);
    }
    // Description
    const descEl = teaser.querySelector('.cmp-teaser__description');
    if (descEl) {
      // If description contains a <p>, use the <p> element(s) directly
      const ps = descEl.querySelectorAll('p');
      if (ps.length > 0) {
        ps.forEach(p => contentParts.push(p));
      } else {
        contentParts.push(descEl);
      }
    }
    // CTA (call-to-action)
    const actionContainer = teaser.querySelector('.cmp-teaser__action-container');
    if (actionContainer) {
      const ctaLink = actionContainer.querySelector('a');
      if (ctaLink) contentParts.push(ctaLink);
    }
    // Defensive: if no content, add empty div
    const contentCell = contentParts.length > 0 ? contentParts : [document.createElement('div')];

    return [imageCell, contentCell];
  });

  // Compose table cells
  const cells = [headerRow, ...rows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
