/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row exactly as in the example
  const cells = [
    ['Carousel (carousel8)']
  ];
  // Find carousel main container
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  // Find the slides container
  const slidesContainer = carousel.querySelector('.cmp-carousel__content');
  if (!slidesContainer) return;
  // Find all slide items
  const slideItems = Array.from(slidesContainer.querySelectorAll('.cmp-carousel__item'));
  if (!slideItems.length) return;

  slideItems.forEach((slide) => {
    // First cell: image element from .image (or any img)
    let img = null;
    const imageDiv = slide.querySelector('.image');
    if (imageDiv) {
      img = imageDiv.querySelector('img');
    }
    if (!img) {
      img = slide.querySelector('img');
    }
    // Second cell: all content except the image container, as robustly as possible
    // Gather non-image direct children as elements
    let textEls = [];
    Array.from(slide.children).forEach(child => {
      if (!child.classList.contains('image')) {
        textEls.push(child);
      }
    });
    // If still empty, check inside the imageDiv for siblings (for some markup variants)
    if (!textEls.length && imageDiv) {
      let sib = imageDiv.nextElementSibling;
      while (sib) {
        textEls.push(sib);
        sib = sib.nextElementSibling;
      }
    }
    // If still empty, but slide has text (rare), use a string fallback
    let textCell = '';
    if (textEls.length > 0) {
      textCell = textEls;
    } else {
      const t = slide.textContent.trim();
      // Only use if there's text that's not just whitespace
      if (t) textCell = t;
    }
    // Always create two cells per row
    cells.push([
      img,
      textCell
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
