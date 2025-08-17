/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as required in the example
  const headerRow = ['Carousel (carousel22)'];
  const cells = [headerRow];

  // Find the carousel content container
  const carouselContent = element.querySelector('.cmp-carousel__content');
  if (!carouselContent) return;

  // Get all slide items (each slide is .cmp-carousel__item)
  const items = carouselContent.querySelectorAll(':scope > .cmp-carousel__item');
  items.forEach(item => {
    // Find image element inside the teaser
    const teaser = item.querySelector('.cmp-teaser');
    let imgEl = null;
    if (teaser) {
      const imageWrapper = teaser.querySelector('.cmp-teaser__image');
      if (imageWrapper) {
        imgEl = imageWrapper.querySelector('img');
      }
    }
    if (!imgEl) return;

    // Compose text content for the second cell
    const textParts = [];
    if (teaser) {
      const content = teaser.querySelector('.cmp-teaser__content');
      if (content) {
        // Title as heading (keep semantic and reference existing element)
        const titleEl = content.querySelector('.cmp-teaser__title');
        if (titleEl) {
          // Use reference to original h2 element
          textParts.push(titleEl);
        }
        // Description block
        const descEl = content.querySelector('.cmp-teaser__description');
        if (descEl) {
          // If it contains block-level children, use them. Otherwise, wrap as <p>
          if (descEl.children.length > 0) {
            Array.from(descEl.children).forEach(child => textParts.push(child));
          } else {
            // Use the original descEl, since it's a block, and reference
            textParts.push(descEl);
          }
        }
        // CTA link
        const actionEl = content.querySelector('.cmp-teaser__action-container .cmp-teaser__action-link');
        if (actionEl) {
          textParts.push(actionEl);
        }
      }
    }

    cells.push([
      imgEl,
      textParts
    ]);
  });

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
