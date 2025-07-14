/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: exactly one column
  const headerRow = ['Carousel (carousel37)'];

  // Find the carousel root
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;

  // Find all slide items
  const slides = carousel.querySelectorAll('.cmp-carousel__content > .cmp-carousel__item');

  // Content rows: each row is [image, text]
  const rows = Array.from(slides).map((slide) => {
    // Get image (first <img> in the slide)
    const img = slide.querySelector('img');
    // Get text content (all children except .image div)
    let textEls = Array.from(slide.children).filter(c => !c.classList.contains('image'));
    // Fallback: look inside .image for text content (excluding cmp-image container)
    if (textEls.length === 0) {
      const imageDiv = slide.querySelector('.image');
      if (imageDiv) {
        textEls = Array.from(imageDiv.children).filter(c => !c.classList.contains('cmp-image'));
      }
    }
    // Only include if not empty
    textEls = textEls.filter(el => el.textContent && el.textContent.trim().length > 0);
    let textCell = '';
    if (textEls.length === 1) textCell = textEls[0];
    else if (textEls.length > 1) textCell = textEls;
    return [img || '', textCell || ''];
  });

  // Compose table: header row (1 col), then rows (2 cols)
  // createTable will automatically make subsequent rows 2 columns
  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
