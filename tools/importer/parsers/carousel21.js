/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract slide info from a cmp-carousel__item
  function extractSlide(slideEl) {
    // Find image (mandatory)
    let imgEl = null;
    const teaserImageDiv = slideEl.querySelector('.cmp-teaser__image');
    if (teaserImageDiv) {
      imgEl = teaserImageDiv.querySelector('img');
    }
    // Defensive: fallback if not found
    if (!imgEl) {
      imgEl = slideEl.querySelector('img');
    }

    // Find text content (title, description, CTA)
    const contentParts = [];
    const teaserContent = slideEl.querySelector('.cmp-teaser__content');
    if (teaserContent) {
      // Title
      const titleEl = teaserContent.querySelector('.cmp-teaser__title');
      if (titleEl) {
        // Use heading element directly
        contentParts.push(titleEl);
      }
      // Description
      const descEl = teaserContent.querySelector('.cmp-teaser__description');
      if (descEl) {
        contentParts.push(descEl);
      }
      // CTA
      const actionContainer = teaserContent.querySelector('.cmp-teaser__action-container');
      if (actionContainer) {
        const ctaLink = actionContainer.querySelector('a');
        if (ctaLink) {
          contentParts.push(ctaLink);
        }
      }
    }
    // Defensive: If no content, use empty string
    const textCell = contentParts.length ? contentParts : '';
    return [imgEl, textCell];
  }

  // Find the carousel content container
  const carouselContent = element.querySelector('.cmp-carousel__content');
  if (!carouselContent) return;

  // Get all slide elements
  const slideEls = carouselContent.querySelectorAll('.cmp-carousel__item');

  // Build table rows
  const headerRow = ['Carousel (carousel21)'];
  const rows = [headerRow];
  slideEls.forEach((slideEl) => {
    rows.push(extractSlide(slideEl));
  });

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace original element
  element.replaceWith(block);
}
