/* global WebImporter */
export default function parse(element, { document }) {
  // Find the carousel block
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;
  const slides = Array.from(content.querySelectorAll('.cmp-carousel__item'));

  // Build the table rows
  const rows = [];
  // Header row: must match example exactly
  rows.push(['Carousel (carousel21)']);

  slides.forEach((slide) => {
    // --- IMAGE CELL ---
    let imageCell = null;
    // Look for cmp-image inside the slide
    const imageWrapper = slide.querySelector('[data-cmp-is="image"]');
    if (imageWrapper) {
      const img = imageWrapper.querySelector('img');
      if (img) imageCell = img;
    }
    // Fallback to any img in slide if structure varies
    if (!imageCell) {
      imageCell = slide.querySelector('img');
    }

    // --- TEXT CELL ---
    // This can include title (as heading), description, and CTA link(s)
    const textCellContents = [];
    // Title (may be <h2> or another heading)
    const title = slide.querySelector('.cmp-teaser__title');
    if (title) {
      // Use a heading tag for semantic meaning (default to h3 for block)
      // But reference existing element's content
      const heading = document.createElement('h3');
      heading.innerHTML = title.innerHTML;
      textCellContents.push(heading);
    }
    // Description comes next
    const desc = slide.querySelector('.cmp-teaser__description');
    if (desc) {
      // If description contains only a single <p>, use that <p>
      if (desc.childElementCount === 1 && desc.firstElementChild.tagName.toLowerCase() === 'p') {
        textCellContents.push(desc.firstElementChild);
      } else {
        // Otherwise, use all children or as is
        Array.from(desc.childNodes).forEach((node) => {
          textCellContents.push(node);
        });
      }
    }
    // CTA(s)
    const ctas = slide.querySelectorAll('.cmp-teaser__action-link');
    ctas.forEach((cta) => {
      textCellContents.push(cta);
    });
    // Clean up: If no text content, make cell blank
    let textCell = textCellContents.length ? textCellContents : '';

    rows.push([imageCell, textCell]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
