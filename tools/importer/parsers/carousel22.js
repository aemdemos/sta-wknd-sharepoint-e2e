/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get all carousel items
  const carouselContent = element.querySelector('.cmp-carousel__content');
  if (!carouselContent) return;

  // Get all direct children with class 'cmp-carousel__item' (each slide)
  const slideEls = Array.from(carouselContent.querySelectorAll(':scope > .cmp-carousel__item'));

  // Table header row
  const headerRow = ['Carousel (carousel22)'];
  const rows = [headerRow];

  slideEls.forEach((slideEl) => {
    // Find image
    let imgEl = null;
    const teaserImageDiv = slideEl.querySelector('.cmp-teaser__image');
    if (teaserImageDiv) {
      imgEl = teaserImageDiv.querySelector('img');
    }

    // Find text content (title, description, CTA)
    const teaserContentDiv = slideEl.querySelector('.cmp-teaser__content');
    const cellContent = [];
    if (teaserContentDiv) {
      // Title
      const titleEl = teaserContentDiv.querySelector('.cmp-teaser__title');
      if (titleEl) cellContent.push(titleEl);
      // Description
      const descEl = teaserContentDiv.querySelector('.cmp-teaser__description');
      if (descEl) cellContent.push(descEl);
      // CTA
      const ctaContainer = teaserContentDiv.querySelector('.cmp-teaser__action-container');
      if (ctaContainer) {
        const ctaLink = ctaContainer.querySelector('a');
        if (ctaLink) cellContent.push(ctaLink);
      }
    }
    // Defensive: If no text content, push empty string
    if (cellContent.length === 0) cellContent.push('');
    // Defensive: If no image, push empty string
    rows.push([imgEl || '', cellContent]);
  });

  // Create table and replace original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
