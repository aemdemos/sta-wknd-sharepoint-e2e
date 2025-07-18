/* global WebImporter */
export default function parse(element, { document }) {
  // Find the carousel root
  const carouselRoot = element.querySelector('.cmp-carousel');
  if (!carouselRoot) return;
  const content = carouselRoot.querySelector('.cmp-carousel__content');
  if (!content) return;
  // Find all slide elements
  const slides = Array.from(content.children).filter(child => child.classList.contains('cmp-carousel__item'));

  // Prepare table rows: header first
  const rows = [['Carousel (carousel12)']];

  slides.forEach((slide) => {
    // Image cell - find <img> inside the teaser image area
    let imageEl = null;
    const imageContainer = slide.querySelector('.cmp-teaser__image [data-cmp-is="image"]');
    if (imageContainer) {
      imageEl = imageContainer.querySelector('img');
    }
    // Fallback: in case img is present elsewhere
    if (!imageEl) {
      imageEl = slide.querySelector('img');
    }
    // Text cell
    const textCellContent = [];
    // Title (Heading)
    const titleEl = slide.querySelector('.cmp-teaser__title');
    if (titleEl) {
      textCellContent.push(titleEl);
    }
    // Description
    const descEl = slide.querySelector('.cmp-teaser__description');
    if (descEl) {
      textCellContent.push(descEl);
    }
    // Call-to-action link
    const ctaEl = slide.querySelector('.cmp-teaser__action-link');
    if (ctaEl) {
      textCellContent.push(ctaEl);
    }
    // If nothing in text cell, leave it empty string
    rows.push([
      imageEl || '',
      textCellContent.length ? (textCellContent.length === 1 ? textCellContent[0] : textCellContent) : ''
    ]);
  });

  // Create the table using the helper
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
