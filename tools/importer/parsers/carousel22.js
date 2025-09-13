/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract slide content
  function extractSlide(slide) {
    // Find image (mandatory)
    let imgEl = null;
    const imgContainer = slide.querySelector('.cmp-teaser__image');
    if (imgContainer) {
      imgEl = imgContainer.querySelector('img');
    }
    // Defensive: fallback if not found
    if (!imgEl) {
      // Try to find any img inside slide
      imgEl = slide.querySelector('img');
    }

    // Find text content (title, description, CTA)
    const contentContainer = slide.querySelector('.cmp-teaser__content');
    const textContent = [];
    if (contentContainer) {
      // Title (Heading)
      const title = contentContainer.querySelector('.cmp-teaser__title');
      if (title) {
        // Use <h2> as is
        textContent.push(title);
      }
      // Description
      const desc = contentContainer.querySelector('.cmp-teaser__description');
      if (desc) {
        textContent.push(desc);
      }
      // CTA link
      const cta = contentContainer.querySelector('.cmp-teaser__action-link');
      if (cta) {
        textContent.push(cta);
      }
    }
    // Defensive: If no content, add empty string
    if (textContent.length === 0) {
      textContent.push('');
    }
    return [imgEl, textContent];
  }

  // Find all carousel slides
  const carouselRoot = element.querySelector('.cmp-carousel');
  if (!carouselRoot) return;
  const slides = Array.from(carouselRoot.querySelectorAll('.cmp-carousel__item'));

  // Build table rows
  const headerRow = ['Carousel (carousel22)'];
  const rows = [headerRow];
  slides.forEach((slide) => {
    const teaser = slide.querySelector('.cmp-teaser');
    if (teaser) {
      rows.push(extractSlide(teaser));
    }
  });

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace original element
  element.replaceWith(block);
}
