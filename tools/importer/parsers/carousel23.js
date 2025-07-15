/* global WebImporter */
export default function parse(element, { document }) {
  // Ensure the header matches the example exactly
  const headerRow = ['Carousel (carousel23)'];

  // Find the carousel wrapper
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;

  // Find the slides container
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;

  // Get all direct children slides
  const slides = Array.from(content.querySelectorAll(':scope > .cmp-carousel__item'));
  if (!slides.length) return;

  const rows = slides.map((slide) => {
    // Image (mandatory)
    let imageEl = null;
    const imgWrap = slide.querySelector('.cmp-teaser__image');
    if (imgWrap) {
      // Prefer direct img, but fallback to first descendant img
      imageEl = imgWrap.querySelector('img') || imgWrap;
    }

    // Text content cell
    const textContent = document.createElement('div');
    let hasTextContent = false;

    // Title (optional; prefer h2, fallback to first child with cmp-teaser__title)
    const titleEl = slide.querySelector('.cmp-teaser__title');
    if (titleEl && titleEl.textContent.trim()) {
      const h2 = document.createElement('h2');
      h2.innerHTML = titleEl.innerHTML;
      textContent.appendChild(h2);
      hasTextContent = true;
    }

    // Description (optional)
    const descEl = slide.querySelector('.cmp-teaser__description');
    if (descEl && descEl.textContent.trim()) {
      // If it already has block children (like <p>), use those, else wrap in <p>
      if ([...descEl.childNodes].some(n => n.nodeType === 1)) {
        descEl.childNodes.forEach((node) => {
          textContent.appendChild(node.cloneNode(true));
        });
      } else {
        const p = document.createElement('p');
        p.textContent = descEl.textContent.trim();
        textContent.appendChild(p);
      }
      hasTextContent = true;
    }

    // CTA (optional)
    // Last in text cell, no extra markup, just add to div
    const ctaEl = slide.querySelector('.cmp-teaser__action-link');
    if (ctaEl) {
      // If there is already some text above, add <br> for separation
      if (hasTextContent) {
        textContent.appendChild(document.createElement('br'));
      }
      textContent.appendChild(ctaEl);
      hasTextContent = true;
    }

    // If no text content, set blank string
    const textCell = hasTextContent ? textContent : '';

    return [imageEl, textCell];
  });

  // Compose the table
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
