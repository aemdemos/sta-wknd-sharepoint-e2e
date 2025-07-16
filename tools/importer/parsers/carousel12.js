/* global WebImporter */
export default function parse(element, { document }) {
  // Helper function to extract data from a single carousel slide
  function extractSlide(slide) {
    // Image (mandatory): first img inside .cmp-teaser__image or [data-cmp-is="image"]
    let imgEl = null;
    const imageContainer = slide.querySelector('.cmp-teaser__image, [data-cmp-is="image"]');
    if (imageContainer) {
      imgEl = imageContainer.querySelector('img');
    }
    // Text content (optional)
    let textContent = [];
    const content = slide.querySelector('.cmp-teaser__content');
    if (content) {
      // Title (optional, should be heading)
      const title = content.querySelector('.cmp-teaser__title, h2, h1, h3, h4, h5, h6');
      if (title) {
        // Use existing heading element for semantic meaning
        textContent.push(title);
      }
      // Description (optional)
      const desc = content.querySelector('.cmp-teaser__description');
      if (desc) {
        // If description contains multiple children (like <p>), keep all
        if (desc.children.length > 0) {
          Array.from(desc.children).forEach(child => textContent.push(child));
        } else if (desc.textContent.trim()) {
          // Otherwise, use its text
          textContent.push(document.createTextNode(desc.textContent.trim()));
        }
      }
      // CTA (optional), usually an anchor in .cmp-teaser__action-container
      const cta = content.querySelector('.cmp-teaser__action-link, a[href]');
      if (cta) {
        // Add a <br> if there is other content in the cell already
        if (textContent.length > 0) {
          textContent.push(document.createElement('br'));
        }
        textContent.push(cta);
      }
    }
    // If textContent is empty, set to '' (no cell)
    return [imgEl, textContent.length ? textContent : ''];
  }

  // Locate the cmp-carousel
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  const carouselContent = carousel.querySelector('.cmp-carousel__content');
  if (!carouselContent) return;
  // Each slide is .cmp-carousel__item
  const slides = carouselContent.querySelectorAll('.cmp-carousel__item');
  if (!slides.length) return;

  // Table header as specified
  const cells = [['Carousel (carousel12)']];
  slides.forEach(slide => {
    // Each slide contains a .teaser or .cmp-teaser; fallback to slide itself
    const teaser = slide.querySelector('.teaser, .cmp-teaser--hero, .cmp-teaser');
    const row = extractSlide(teaser || slide);
    cells.push(row);
  });

  // Build block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
