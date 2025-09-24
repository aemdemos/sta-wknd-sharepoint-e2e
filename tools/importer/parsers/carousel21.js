/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract slide info from carousel item
  function extractSlideContent(carouselItem) {
    // Find teaser block inside the carousel item
    const teaser = carouselItem.querySelector('.cmp-teaser');
    if (!teaser) return [null, null];

    // Find image element (mandatory)
    let image = null;
    const teaserImageDiv = teaser.querySelector('.cmp-teaser__image');
    if (teaserImageDiv) {
      // Find <img> inside teaserImageDiv
      image = teaserImageDiv.querySelector('img');
    }

    // Find text content (title, description, CTA)
    const contentDiv = teaser.querySelector('.cmp-teaser__content');
    let textContent = [];
    if (contentDiv) {
      // Title
      const title = contentDiv.querySelector('.cmp-teaser__title');
      if (title) {
        // Use heading element directly
        textContent.push(title);
      }
      // Description
      const desc = contentDiv.querySelector('.cmp-teaser__description');
      if (desc) {
        textContent.push(desc);
      }
      // CTA link
      const ctaContainer = contentDiv.querySelector('.cmp-teaser__action-container');
      if (ctaContainer) {
        const ctaLink = ctaContainer.querySelector('a');
        if (ctaLink) {
          textContent.push(ctaLink);
        }
      }
    }
    return [image, textContent.length ? textContent : null];
  }

  // Find all carousel items (slides)
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;
  const slideEls = Array.from(content.querySelectorAll(':scope > .cmp-carousel__item'));

  // Build table rows
  const rows = [];
  const headerRow = ['Carousel (carousel21)'];
  rows.push(headerRow);

  slideEls.forEach((slideEl) => {
    const [image, textContent] = extractSlideContent(slideEl);
    // Defensive: Only add row if image exists
    if (image) {
      rows.push([
        image,
        textContent || ''
      ]);
    }
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
