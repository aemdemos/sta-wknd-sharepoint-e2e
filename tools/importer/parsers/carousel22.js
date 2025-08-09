/* global WebImporter */
export default function parse(element, { document }) {
  // Header row matches exactly
  const headerRow = ['Carousel (carousel22)'];

  // Find the carousel root - the first .cmp-carousel inside element
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;

  // Find all slides (direct children of .cmp-carousel__content)
  const slides = Array.from(
    carousel.querySelectorAll(':scope > .cmp-carousel__content > .cmp-carousel__item')
  );

  const rows = slides.map((slide) => {
    // Each slide should always have a teaser
    const teaser = slide.querySelector('.cmp-teaser');
    let imgEl = null;
    let textCell = [];

    if (teaser) {
      // Image: find first <img> under .cmp-teaser__image
      const imgContainer = teaser.querySelector('.cmp-teaser__image');
      if (imgContainer) {
        imgEl = imgContainer.querySelector('img');
      }

      // Title: look for h2.cmp-teaser__title
      const title = teaser.querySelector('.cmp-teaser__title');
      if (title) {
        textCell.push(title);
      }
      // Description: .cmp-teaser__description (could contain HTML)
      const desc = teaser.querySelector('.cmp-teaser__description');
      if (desc) {
        textCell.push(desc);
      }
      // CTA: .cmp-teaser__action-link (if present)
      const cta = teaser.querySelector('.cmp-teaser__action-link');
      if (cta) {
        textCell.push(cta);
      }
    }
    // Defensive: image is required, but if missing, skip row
    if (!imgEl) {
      return null;
    }
    // If there is no text content, supply empty string for cell
    return [imgEl, textCell.length > 0 ? textCell : ''];
  }).filter(Boolean); // Remove any null rows (should not happen)

  // Compose table rows
  const tableData = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(tableData, document);
  element.replaceWith(block);
}
