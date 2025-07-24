/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract a slide row from a cmp-carousel__item
  function getSlideRow(carouselItem) {
    // Find teaser image (mandatory) in the slide
    let imgEl = null;
    const imgDiv = carouselItem.querySelector('.cmp-teaser__image');
    if (imgDiv) {
      imgEl = imgDiv.querySelector('img');
    }
    if (!imgEl) {
      imgEl = carouselItem.querySelector('img');
    }
    // Text content cell
    let textCellContent = [];
    const contentDiv = carouselItem.querySelector('.cmp-teaser__content');
    if (contentDiv) {
      // Heading (keep original tag for semantics, reference, don't clone)
      const title = contentDiv.querySelector('.cmp-teaser__title');
      if (title) {
        textCellContent.push(title);
      }
      // Description (ensure all nodes included, keep <p> if present)
      const desc = contentDiv.querySelector('.cmp-teaser__description');
      if (desc) {
        Array.from(desc.childNodes).forEach((c) => textCellContent.push(c));
      }
      // CTA (place below, as in source)
      const cta = contentDiv.querySelector('.cmp-teaser__action-link');
      if (cta) {
        // Separate with a <br> only if other content exists
        if (textCellContent.length > 0) {
          textCellContent.push(document.createElement('br'));
        }
        textCellContent.push(cta);
      }
    } else {
      // Fallback: find all children of .cmp-teaser except image
      const teaser = carouselItem.querySelector('.cmp-teaser');
      if (teaser) {
        Array.from(teaser.children).forEach((child) => {
          if (!child.classList.contains('cmp-teaser__image')) {
            textCellContent.push(child);
          }
        });
      }
    }
    // If nothing, keep cell empty
    if (textCellContent.length === 0) textCellContent = [''];
    return [imgEl, textCellContent];
  }

  // Find carousel items
  const cmpCarousel = element.querySelector('.cmp-carousel');
  if (!cmpCarousel) return;
  const content = cmpCarousel.querySelector('.cmp-carousel__content');
  if (!content) return;
  const items = content.querySelectorAll('.cmp-carousel__item');
  if (!items.length) return;

  // Compose table rows
  const cells = [['Carousel (carousel22)']];
  items.forEach((item) => {
    const row = getSlideRow(item);
    cells.push(row);
  });

  // Build and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
