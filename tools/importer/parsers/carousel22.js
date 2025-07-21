/* global WebImporter */
export default function parse(element, { document }) {
  // Find the carousel block
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  // Get all slides
  const slides = carousel.querySelectorAll('.cmp-carousel__content > .cmp-carousel__item');
  const cells = [];
  // Header row must match example exactly
  const headerRow = ['Carousel (carousel22)'];
  cells.push(headerRow);
  slides.forEach((slide) => {
    // LEFT CELL: Image (mandatory)
    let imageEl = null;
    const imgContainer = slide.querySelector('.cmp-teaser__image');
    if (imgContainer) {
      imageEl = imgContainer.querySelector('img');
    }
    // RIGHT CELL: Textual content (optional), as an array
    const contentEls = [];
    const contentDiv = slide.querySelector('.cmp-teaser__content');
    if (contentDiv) {
      // Title (h2, optional)
      const title = contentDiv.querySelector('.cmp-teaser__title');
      if (title) {
        // If it's not a heading, wrap as h2
        let heading = title;
        if (!/^h[1-6]$/i.test(title.tagName)) {
          const h2 = document.createElement('h2');
          h2.textContent = title.textContent;
          heading = h2;
        }
        contentEls.push(heading);
      }
      // Description (may have block tags inside)
      const description = contentDiv.querySelector('.cmp-teaser__description');
      if (description) {
        // If has block children, append them all; else wrap in <p>
        if (Array.from(description.childNodes).some(n => n.nodeType === 1)) {
          Array.from(description.childNodes).forEach((n) => {
            contentEls.push(n);
          });
        } else if (description.textContent.trim()) {
          const p = document.createElement('p');
          p.textContent = description.textContent.trim();
          contentEls.push(p);
        }
      }
      // CTA link (optional)
      const cta = contentDiv.querySelector('.cmp-teaser__action-link');
      if (cta) {
        contentEls.push(cta);
      }
    }
    // Push row: always 2 columns (image, content)
    cells.push([
      imageEl,
      contentEls
    ]);
  });
  // Build the block table and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
