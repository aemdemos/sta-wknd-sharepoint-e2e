/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare header row exactly as in the example
  const headerRow = ['Carousel (carousel22)'];
  const rows = [headerRow];

  // Find the main carousel structure
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  const carouselContent = carousel.querySelector('.cmp-carousel__content');
  if (!carouselContent) return;

  // Get all carousel slide items
  const slideItems = carouselContent.querySelectorAll('.cmp-carousel__item');
  slideItems.forEach((slide) => {
    // Get the image element (first <img> within .cmp-teaser__image .cmp-image)
    let imageEl = null;
    const teaserImageContainer = slide.querySelector('.cmp-teaser__image .cmp-image');
    if (teaserImageContainer) {
      imageEl = teaserImageContainer.querySelector('img');
    }
    // Fallback: any <img> in the slide
    if (!imageEl) {
      imageEl = slide.querySelector('img');
    }

    // Prepare the text cell contents
    const textCellContent = [];
    // Title (keep heading level as-is, reference existing element)
    const titleEl = slide.querySelector('.cmp-teaser__title');
    if (titleEl) textCellContent.push(titleEl);
    // Description (may be just text or <p>)
    const descEl = slide.querySelector('.cmp-teaser__description');
    if (descEl) {
      // If there's only a single <p>, use that directly for better semantics
      if (descEl.childElementCount === 1 && descEl.firstElementChild.tagName === 'P') {
        textCellContent.push(descEl.firstElementChild);
      } else {
        textCellContent.push(descEl);
      }
    }
    // Call-to-Action (link)
    const ctaEl = slide.querySelector('.cmp-teaser__action-link');
    if (ctaEl) textCellContent.push(ctaEl);

    // Only add a slide row if there's a valid image
    if (imageEl) {
      rows.push([
        imageEl,
        textCellContent.length > 0 ? textCellContent : ''
      ]);
    }
  });

  // Build the block table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
