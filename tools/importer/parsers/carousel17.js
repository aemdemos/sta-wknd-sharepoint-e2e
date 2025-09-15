/* global WebImporter */
export default function parse(element, { document }) {
  // Find the carousel content container
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;

  // Get all slide items
  const items = Array.from(content.querySelectorAll(':scope > .cmp-carousel__item'));

  // Table header row: exactly one column
  const headerRow = ['Carousel (carousel17)'];
  const rows = [headerRow];

  items.forEach((item) => {
    // Find image element (mandatory)
    let imgEl = item.querySelector('img');
    if (!imgEl) return;

    // Try to find all text content (title, description, CTA, etc.)
    // Look for text inside .cmp-carousel__item, but outside the image
    let textContent = [];
    // Find all elements that are not inside the image container
    // In this HTML, all text is inside the image's attributes (alt, title)
    // So we need to extract those
    const title = imgEl.getAttribute('title');
    const alt = imgEl.getAttribute('alt');

    // Compose text cell
    if (title || alt) {
      const div = document.createElement('div');
      if (title) {
        const h2 = document.createElement('h2');
        h2.textContent = title;
        div.appendChild(h2);
      }
      if (alt && alt !== title) {
        const p = document.createElement('p');
        p.textContent = alt;
        div.appendChild(p);
      }
      textContent.push(div);
    }

    // Always use two columns: image, then text (can be empty)
    rows.push([imgEl, textContent.length ? textContent : '']);
  });

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace original element
  element.replaceWith(block);
}
