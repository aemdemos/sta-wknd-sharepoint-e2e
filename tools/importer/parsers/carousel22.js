/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the carousel content container
  const carouselContent = element.querySelector('.cmp-carousel__content');
  if (!carouselContent) return;

  // Table header row as required
  const headerRow = ['Carousel (carousel22)'];
  const rows = [headerRow];

  // Get all carousel items (slides)
  const slideEls = carouselContent.querySelectorAll(':scope > .cmp-carousel__item');

  slideEls.forEach((slideEl) => {
    // Defensive: Find teaser block inside slide
    const teaser = slideEl.querySelector('.cmp-teaser');
    if (!teaser) return;

    // --- IMAGE CELL ---
    // Find image container
    let imgCell = null;
    const teaserImage = teaser.querySelector('.cmp-teaser__image');
    if (teaserImage) {
      // Find actual <img> element
      const imgEl = teaserImage.querySelector('img');
      if (imgEl) {
        imgCell = imgEl;
      }
    }

    // --- TEXT CELL ---
    const textCellContent = [];
    // Title (h2)
    const titleEl = teaser.querySelector('.cmp-teaser__title');
    if (titleEl) {
      // Use heading element directly
      textCellContent.push(titleEl);
    }
    // Description
    const descEl = teaser.querySelector('.cmp-teaser__description');
    if (descEl) {
      textCellContent.push(descEl);
    }
    // CTA link
    const ctaEl = teaser.querySelector('.cmp-teaser__action-link');
    if (ctaEl) {
      textCellContent.push(ctaEl);
    }

    // Defensive: If no text content, use empty string
    const textCell = textCellContent.length ? textCellContent : '';
    // Defensive: If no image, use empty string
    const imageCell = imgCell ? imgCell : '';

    rows.push([imageCell, textCell]);
  });

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace original element
  element.replaceWith(block);
}
