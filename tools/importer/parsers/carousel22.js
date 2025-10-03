/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract slide info from a carousel item
  function extractSlideContent(carouselItem) {
    // Find the teaser block inside the carousel item
    const teaser = carouselItem.querySelector('.cmp-teaser');
    if (!teaser) return [null, null];

    // Get image (first cell)
    let imageEl = null;
    const imageContainer = teaser.querySelector('.cmp-teaser__image');
    if (imageContainer) {
      // Find the <img> inside the image block
      imageEl = imageContainer.querySelector('img');
    }

    // Get text content (second cell)
    const textContent = document.createElement('div');
    // Title
    const titleEl = teaser.querySelector('.cmp-teaser__title');
    if (titleEl) {
      // Use h2 as is, but clone to avoid moving from DOM
      textContent.appendChild(titleEl.cloneNode(true));
    }
    // Description
    const descEl = teaser.querySelector('.cmp-teaser__description');
    if (descEl) {
      // Clone the description (may contain <p> or just text)
      textContent.appendChild(descEl.cloneNode(true));
    }
    // CTA
    const ctaEl = teaser.querySelector('.cmp-teaser__action-link');
    if (ctaEl) {
      textContent.appendChild(ctaEl.cloneNode(true));
    }
    // If no text content, leave cell empty
    const textCell = textContent.childNodes.length > 0 ? textContent : '';
    return [imageEl, textCell];
  }

  // Find the carousel content wrapper
  const carouselContent = element.querySelector('.cmp-carousel__content');
  if (!carouselContent) return;

  // Get all carousel items (slides)
  const slideEls = Array.from(carouselContent.querySelectorAll(':scope > .cmp-carousel__item'));

  // Build table rows
  const rows = [];
  // Header row
  rows.push(['Carousel (carousel22)']);
  // Slide rows
  slideEls.forEach((item) => {
    const [img, text] = extractSlideContent(item);
    if (img) {
      rows.push([img, text]);
    }
  });

  // Create table and replace original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
