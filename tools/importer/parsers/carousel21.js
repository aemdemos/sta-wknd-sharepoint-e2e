/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the carousel root
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;

  // Find all carousel slides
  const slides = Array.from(content.querySelectorAll('.cmp-carousel__item'));
  if (!slides.length) return;

  // Prepare table rows
  const rows = [];
  // Block header row (must match block name exactly)
  rows.push(['Carousel (carousel21)']);

  slides.forEach((slide) => {
    // Each slide contains a .cmp-teaser
    const teaser = slide.querySelector('.cmp-teaser');
    if (!teaser) return;

    // --- IMAGE CELL ---
    let imageCell = '';
    const img = teaser.querySelector('.cmp-teaser__image img');
    if (img) {
      // Reference the actual image element from the DOM
      imageCell = img;
    }

    // --- TEXT CELL ---
    // Compose a div to hold all text content
    let textCell = '';
    const textDiv = document.createElement('div');
    let hasText = false;

    // Title (as heading)
    const title = teaser.querySelector('.cmp-teaser__title');
    if (title && title.textContent.trim()) {
      const h2 = document.createElement('h2');
      h2.textContent = title.textContent.trim();
      textDiv.appendChild(h2);
      hasText = true;
    }

    // Description (may contain HTML)
    const desc = teaser.querySelector('.cmp-teaser__description');
    if (desc) {
      // Copy all child nodes (preserve <p>, <br>, etc.)
      desc.childNodes.forEach((node) => {
        textDiv.appendChild(node.cloneNode(true));
      });
      hasText = true;
    }

    // CTA (link)
    const cta = teaser.querySelector('.cmp-teaser__action-link');
    if (cta) {
      // Add a <br> if there is already content
      if (hasText) {
        textDiv.appendChild(document.createElement('br'));
      }
      textDiv.appendChild(cta);
      hasText = true;
    }

    if (hasText) {
      textCell = textDiv;
    }

    rows.push([imageCell, textCell]);
  });

  // Create and replace with the carousel block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
