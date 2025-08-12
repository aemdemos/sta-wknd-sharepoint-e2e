/* global WebImporter */
export default function parse(element, { document }) {
  // HEADER ROW: Block name as in example
  const headerRow = ['Carousel (carousel22)'];
  const cells = [headerRow];

  // Find carousel content container
  const carouselContent = element.querySelector('.cmp-carousel__content');
  if (!carouselContent) return;

  // Select all carousel items (slides)
  const slideElements = carouselContent.querySelectorAll('.cmp-carousel__item');

  slideElements.forEach((slide) => {
    // --- Image ---
    let imageEl = null;
    // Find the teaser image
    const teaserImageContainer = slide.querySelector('.cmp-teaser__image');
    if (teaserImageContainer) {
      imageEl = teaserImageContainer.querySelector('img'); // Use reference from DOM
    }
    // Fallback if not found
    if (!imageEl) {
      imageEl = slide.querySelector('img');
    }
    // --- Text Content ---
    const textContent = [];
    const teaserContent = slide.querySelector('.cmp-teaser__content');
    if (teaserContent) {
      // Title: Styled as Heading (preserve heading element)
      const titleEl = teaserContent.querySelector('.cmp-teaser__title');
      if (titleEl) textContent.push(titleEl);
      // Description: preserve <div> or <p> structure
      const descEl = teaserContent.querySelector('.cmp-teaser__description');
      if (descEl) {
        // If descEl contains a <p>, push the <p>, else push descEl
        const p = descEl.querySelector('p');
        if (p) {
          textContent.push(p);
        } else {
          textContent.push(descEl);
        }
      }
      // Call-to-action link(s) at bottom
      const actionContainer = teaserContent.querySelector('.cmp-teaser__action-container');
      if (actionContainer) {
        // Find all links inside
        const links = actionContainer.querySelectorAll('a');
        links.forEach(link => {
          textContent.push(link);
        });
      }
    }
    // Push row: [image, text] (preserve reference, do not clone)
    cells.push([
      imageEl ? imageEl : '',
      textContent.length ? textContent : ''
    ]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
