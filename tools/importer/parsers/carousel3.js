/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cmp-carousel block inside the given element
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;

  // Get all slide items
  const slides = Array.from(carousel.querySelectorAll(':scope > .cmp-carousel__content > .cmp-carousel__item'));

  // Build the block table
  const rows = [];
  rows.push(['Carousel (carousel3)']); // Header row

  slides.forEach((slide) => {
    // Image: must be the first cell
    let imgEl = null;
    const imageContainer = slide.querySelector('.cmp-teaser__image');
    if (imageContainer) {
      imgEl = imageContainer.querySelector('img');
    }

    // Text content: second cell
    const teaserContent = slide.querySelector('.cmp-teaser__content');
    const contentArr = [];
    if (teaserContent) {
      // Title (heading)
      const titleEl = teaserContent.querySelector('.cmp-teaser__title');
      if (titleEl) contentArr.push(titleEl);
      // Description (could be plain div or p)
      const descEl = teaserContent.querySelector('.cmp-teaser__description');
      if (descEl) contentArr.push(descEl);
      // CTA (link)
      const ctaContainer = teaserContent.querySelector('.cmp-teaser__action-container');
      if (ctaContainer) {
        const ctaEl = ctaContainer.querySelector('a.cmp-teaser__action-link');
        if (ctaEl) contentArr.push(ctaEl);
      }
    }
    // If there is no teaser content, leave the cell empty (string)
    rows.push([
      imgEl,
      (contentArr.length > 0 ? contentArr : '')
    ]);
  });

  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
