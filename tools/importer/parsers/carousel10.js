/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract the first img from a teaser block
  function extractImage(teaserEl) {
    // Find the image inside the teaser
    const img = teaserEl.querySelector('.cmp-teaser__image img');
    // Reference the existing element, not clone
    return img || '';
  }

  // Helper to extract the text content from a teaser block (title, desc, cta)
  function extractTextContent(teaserEl) {
    const content = document.createElement('div');
    // Title
    const title = teaserEl.querySelector('.cmp-teaser__title');
    if (title) {
      // Reference the existing heading element
      content.appendChild(title);
    }
    // Description (can be HTML)
    const desc = teaserEl.querySelector('.cmp-teaser__description');
    if (desc) {
      // Reference the existing element
      content.appendChild(desc);
    }
    // CTA (optional)
    const cta = teaserEl.querySelector('.cmp-teaser__action-link');
    if (cta) {
      content.appendChild(cta);
    }
    // Only return if there's actual content
    return content.childNodes.length ? content : '';
  }

  // Find the carousel content wrapper
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  const slides = carousel.querySelectorAll('.cmp-carousel__content > .cmp-carousel__item');

  // Build rows: header + 1 row per slide
  const rows = [];
  const headerRow = ['Carousel (carousel10)'];
  rows.push(headerRow);

  slides.forEach((slide) => {
    // Each slide contains a .teaser block
    const teaser = slide.querySelector('.cmp-teaser');
    if (!teaser) return;
    // First cell: image (mandatory)
    const img = extractImage(teaser);
    // Second cell: text content (title, desc, cta)
    const textContent = extractTextContent(teaser);
    rows.push([
      img,
      textContent,
    ]);
  });

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
