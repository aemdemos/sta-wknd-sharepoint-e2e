/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to create a header <th> with colspan
  function createHeaderCell(label, colspan) {
    const th = document.createElement('th');
    th.textContent = label;
    th.setAttribute('colspan', colspan);
    return th;
  }

  // Find the carousel root
  const carousel = Array.from(element.children).find(e => e.classList && e.classList.contains('cmp-carousel'));
  if (!carousel) return;

  // Find the content section
  const content = Array.from(carousel.children).find(e => e.classList && e.classList.contains('cmp-carousel__content'));
  if (!content) return;

  // Get all slides
  const slides = Array.from(content.children).filter(e => e.classList && e.classList.contains('cmp-carousel__item'));

  // Always 2 columns for Carousel block: image, text
  const numCols = 2;
  const rows = [];

  // Add header with colspan=2
  const headerCell = createHeaderCell('Carousel (carousel31)', numCols);
  rows.push([headerCell]);

  slides.forEach(slide => {
    // Get the image element (mandatory)
    let imageCell = '';
    const imageDiv = slide.querySelector('.image');
    if (imageDiv) imageCell = imageDiv;
    // Get the text cell (all non-image direct children)
    const textNodes = [];
    Array.from(slide.children).forEach(child => {
      if (!child.classList.contains('image')) {
        textNodes.push(child);
      }
    });
    const textCell = textNodes.length ? textNodes : '';
    rows.push([imageCell, textCell]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
