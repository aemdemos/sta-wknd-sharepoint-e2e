/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract info from a single carousel item
  function extractSlideContent(carouselItem) {
    // Image cell: required
    let imgCell = '';
    // Text cell: can be empty
    let textCell = '';
    // Find the main teaser inside this item
    const teaser = carouselItem.querySelector('.cmp-teaser');
    if (teaser) {
      // Find the image: prefer the existing <img> element inside .cmp-teaser__image
      const imgWrapper = teaser.querySelector('.cmp-teaser__image');
      if (imgWrapper) {
        const img = imgWrapper.querySelector('img');
        if (img) {
          imgCell = img;
        }
      }
      // Compose the text cell
      const textParts = [];
      const teaserContent = teaser.querySelector('.cmp-teaser__content');
      if (teaserContent) {
        // Title (h2)
        const title = teaserContent.querySelector('.cmp-teaser__title');
        if (title) {
          const h2 = document.createElement('h2');
          h2.textContent = title.textContent.trim();
          textParts.push(h2);
        }
        // Description
        const desc = teaserContent.querySelector('.cmp-teaser__description');
        if (desc) {
          // If description contains block elements, preserve them
          // Otherwise, wrap in div for separation
          if (desc.children.length > 0) {
            Array.from(desc.children).forEach(child => {
              textParts.push(child);
            });
          } else {
            const descDiv = document.createElement('div');
            descDiv.textContent = desc.textContent.trim();
            textParts.push(descDiv);
          }
        }
        // CTA (link)
        const cta = teaserContent.querySelector('.cmp-teaser__action-link');
        if (cta) {
          // Reference the existing link element
          textParts.push(cta);
        }
      }
      if (textParts.length > 0) {
        // Wrap all text parts in a single <div> to keep semantic grouping
        const wrapper = document.createElement('div');
        textParts.forEach(part => wrapper.appendChild(part));
        textCell = wrapper;
      }
    }
    // Always two cells: [img, text]
    return [imgCell, textCell];
  }

  // Find the main carousel container
  let carousel = element.querySelector('.cmp-carousel');
  if (!carousel) carousel = element;
  const slides = Array.from(carousel.querySelectorAll('.cmp-carousel__item'));

  // Build the cells array for the block table
  const cells = [];
  // Header row: from the spec and example
  cells.push(['Carousel (carousel22)']);
  // Each slide becomes a row
  slides.forEach(slide => {
    cells.push(extractSlideContent(slide));
  });

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
