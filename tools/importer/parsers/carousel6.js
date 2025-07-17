/* global WebImporter */
export default function parse(element, { document }) {
  // Find the carousel container
  let carousel = element.querySelector('.cmp-carousel');
  if (!carousel) {
    if (element.classList.contains('cmp-carousel')) carousel = element;
  }
  if (!carousel) return;

  // Get all slides
  const slides = Array.from(carousel.querySelectorAll('.cmp-carousel__item'));
  if (!slides.length) return;

  // Table header as in example
  const rows = [['Carousel (carousel6)']];

  slides.forEach((slide) => {
    // First column: the image (mandatory)
    let img = slide.querySelector('.cmp-teaser__image img');
    if (!img) {
      img = slide.querySelector('img');
    }
    // img is required, if missing, skip the slide
    if (!img) return;

    // Second column: text content (title, description, CTA)
    const cellContent = [];
    // Heading: .cmp-teaser__title (use h2 as in example)
    const title = slide.querySelector('.cmp-teaser__title, h2, h3, h4, h5, h6');
    if (title) {
      // Use existing element, but ensure it's an h2
      let headingElem = title;
      if (headingElem.tagName.toLowerCase() !== 'h2') {
        // Create a new h2 and transfer textContent
        const h2 = document.createElement('h2');
        h2.textContent = headingElem.textContent.trim();
        headingElem = h2;
      }
      cellContent.push(headingElem);
    }
    // Description: .cmp-teaser__description
    const desc = slide.querySelector('.cmp-teaser__description');
    if (desc) {
      // If it's just a <div>, append its children (preserving p, etc.)
      if (desc.children.length > 0) {
        Array.from(desc.children).forEach(child => cellContent.push(child));
      } else if (desc.textContent.trim()) {
        // Plain text
        const p = document.createElement('p');
        p.textContent = desc.textContent.trim();
        cellContent.push(p);
      }
    }
    // CTA link: .cmp-teaser__action-link
    const cta = slide.querySelector('.cmp-teaser__action-link, .cmp-teaser__action a, .cmp-teaser__action-container a');
    if (cta) {
      cellContent.push(document.createElement('br'));
      cellContent.push(cta);
    }
    // Build the row (always 2 columns)
    rows.push([
      img,
      cellContent.length ? cellContent : '',
    ]);
  });

  // Create and replace block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
