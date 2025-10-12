/* global WebImporter */
export default function parse(element, { document }) {
  // Carousel (carousel22) block parsing

  // Helper to extract a slide's image and content
  function extractSlideContent(carouselItem) {
    let imageEl = null;
    let contentEls = [];

    // Find teaser block
    const teaser = carouselItem.querySelector('.cmp-teaser');
    if (teaser) {
      // Image: look for .cmp-teaser__image img
      const teaserImage = teaser.querySelector('.cmp-teaser__image img');
      if (teaserImage) {
        imageEl = teaserImage;
      }
      // Content: title, description, CTA
      const teaserContent = teaser.querySelector('.cmp-teaser__content');
      if (teaserContent) {
        // Title
        const titleEl = teaserContent.querySelector('.cmp-teaser__title');
        if (titleEl) {
          contentEls.push(titleEl);
        }
        // Description
        const descEl = teaserContent.querySelector('.cmp-teaser__description');
        if (descEl) {
          contentEls.push(descEl);
        }
        // CTA (action link)
        const ctaContainer = teaserContent.querySelector('.cmp-teaser__action-container');
        if (ctaContainer) {
          const ctaLink = ctaContainer.querySelector('a');
          if (ctaLink) {
            contentEls.push(ctaLink);
          }
        }
      }
    }
    return [imageEl, contentEls];
  }

  // Find all carousel items
  const items = Array.from(
    element.querySelectorAll('.cmp-carousel__content > .cmp-carousel__item')
  );

  // Build table rows
  const headerRow = ['Carousel (carousel22)'];
  const rows = [headerRow];

  items.forEach((item) => {
    const [imageEl, contentEls] = extractSlideContent(item);
    // Defensive: only add row if image exists
    if (imageEl) {
      rows.push([
        imageEl,
        contentEls.length ? contentEls : ''
      ]);
    }
  });

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace original element
  element.replaceWith(block);
}
