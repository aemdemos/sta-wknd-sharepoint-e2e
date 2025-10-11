/* global WebImporter */
export default function parse(element, { document }) {
  // Carousel (carousel6) block parsing
  // 1. Header row
  const headerRow = ['Carousel (carousel6)'];

  // 2. Find all carousel items (slides)
  // Defensive: look for .cmp-carousel__item direct children of .cmp-carousel__content
  const carouselContent = element.querySelector('.cmp-carousel__content');
  if (!carouselContent) return;
  const slideEls = Array.from(carouselContent.querySelectorAll(':scope > .cmp-carousel__item'));

  // 3. For each slide, extract image and content
  const rows = slideEls.map((slide) => {
    // Image extraction
    let imgEl = null;
    const teaserImageDiv = slide.querySelector('.cmp-teaser__image');
    if (teaserImageDiv) {
      // Find the actual <img> inside
      imgEl = teaserImageDiv.querySelector('img');
    }
    // Defensive fallback: if no teaser image, try any img
    if (!imgEl) {
      imgEl = slide.querySelector('img');
    }

    // Content extraction
    const contentParts = [];
    const teaserContent = slide.querySelector('.cmp-teaser__content');
    if (teaserContent) {
      // Title
      const titleEl = teaserContent.querySelector('.cmp-teaser__title');
      if (titleEl) contentParts.push(titleEl);
      // Description
      const descEl = teaserContent.querySelector('.cmp-teaser__description');
      if (descEl) contentParts.push(descEl);
      // CTA
      const ctaContainer = teaserContent.querySelector('.cmp-teaser__action-container');
      if (ctaContainer) {
        const ctaLink = ctaContainer.querySelector('a');
        if (ctaLink) contentParts.push(ctaLink);
      }
    }
    // Defensive fallback: if no .cmp-teaser__content, try to get all text and links
    if (contentParts.length === 0) {
      // Try to get heading, paragraph, and link
      const heading = slide.querySelector('h1, h2, h3, h4, h5, h6');
      if (heading) contentParts.push(heading);
      const paragraph = slide.querySelector('p');
      if (paragraph) contentParts.push(paragraph);
      const link = slide.querySelector('a');
      if (link) contentParts.push(link);
    }

    // Always: image in first cell, content in second cell
    return [imgEl, contentParts];
  });

  // 4. Build table
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // 5. Replace element
  element.replaceWith(table);
}
