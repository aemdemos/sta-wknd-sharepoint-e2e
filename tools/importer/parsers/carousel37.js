/* global WebImporter */
export default function parse(element, { document }) {
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;
  const slides = Array.from(content.querySelectorAll('.cmp-carousel__item'));
  const rows = [['Carousel (carousel37)']];
  slides.forEach((slide) => {
    // IMAGE CELL
    let img = slide.querySelector('img');
    let imgCell = img;
    if (img && img.parentElement && img.parentElement.classList.contains('cmp-image')) {
      imgCell = img.parentElement;
    }
    // TEXT CELL: collect all non-image elements with meaningful content
    let textCell = '';
    let textBlocks = [];
    // Find all non-image children
    Array.from(slide.children).forEach(child => {
      if (!child.classList.contains('image') && (child.textContent.trim() || child.querySelector('a,button,iframe'))) {
        textBlocks.push(child);
      }
    });
    // Also check inside .image for siblings that are not images (text wrappers, captions, overlays)
    const imageDiv = slide.querySelector('.image');
    if (imageDiv) {
      Array.from(imageDiv.children).forEach(child => {
        if (!child.querySelector('img') && (child.textContent.trim() || child.querySelector('a,button,iframe'))) {
          textBlocks.push(child);
        }
      });
    }
    // If any text blocks found, use them; if not, leave cell blank
    if (textBlocks.length > 0) {
      textCell = textBlocks;
    }
    rows.push([imgCell, textCell]);
  });
  const table = WebImporter.DOMUtils.createTable(rows, document);
  if (table.rows.length > 1 && table.rows[1].cells.length === 2) {
    table.rows[0].cells[0].setAttribute('colspan', '2');
  }
  element.replaceWith(table);
}
