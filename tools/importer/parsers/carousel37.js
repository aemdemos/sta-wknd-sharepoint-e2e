/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-carousel node within the widget block
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;

  const slides = Array.from(content.querySelectorAll(':scope > .cmp-carousel__item'));
  const rows = [];
  // Header row: must be a single cell/column only
  rows.push(['Carousel (carousel37)']);

  slides.forEach((slide) => {
    // Get image cell: .image block if present, else ''
    let imageCell = '';
    const imageContainer = slide.querySelector(':scope > .image');
    if (imageContainer) {
      imageCell = imageContainer;
    }

    // Get text cell: gather all direct children NOT .image (headings, paragraphs, links, etc)
    const textFragments = [];
    Array.from(slide.children).forEach((child) => {
      if (!child.classList.contains('image')) {
        textFragments.push(child);
      }
    });
    let textCell = '';
    if (textFragments.length > 0) {
      textCell = textFragments;
    }
    // Each slide row: exactly two columns
    rows.push([imageCell, textCell]);
  });

  // Create the table and replace the element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
