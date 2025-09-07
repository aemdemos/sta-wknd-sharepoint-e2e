/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the carousel content container
  const carouselContent = element.querySelector('.cmp-carousel__content');
  if (!carouselContent) return;

  // Get all carousel items (slides)
  const slideEls = Array.from(carouselContent.querySelectorAll(':scope > .cmp-carousel__item'));

  // Table header row
  const headerRow = ['Carousel (carousel22)'];
  const rows = [headerRow];

  // For each slide, extract image and text content
  slideEls.forEach((slideEl) => {
    // Find image element (first cell)
    let imgEl = null;
    const teaserImageContainer = slideEl.querySelector('.cmp-teaser__image');
    if (teaserImageContainer) {
      imgEl = teaserImageContainer.querySelector('img');
    }
    // Defensive: if no image, skip this slide
    if (!imgEl) return;

    // Find text content (second cell)
    const teaserContent = slideEl.querySelector('.cmp-teaser__content');
    let textCellContent = [];
    if (teaserContent) {
      // Title
      const titleEl = teaserContent.querySelector('.cmp-teaser__title');
      if (titleEl) textCellContent.push(titleEl);
      // Description
      const descEl = teaserContent.querySelector('.cmp-teaser__description');
      if (descEl) textCellContent.push(descEl);
      // CTA link
      const ctaContainer = teaserContent.querySelector('.cmp-teaser__action-container');
      if (ctaContainer) {
        const ctaLink = ctaContainer.querySelector('a');
        if (ctaLink) textCellContent.push(ctaLink);
      }
    }
    // If no text content, use empty string
    if (textCellContent.length === 0) textCellContent = [''];

    rows.push([imgEl, textCellContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
