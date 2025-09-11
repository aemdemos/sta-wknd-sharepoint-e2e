/* global WebImporter */
export default function parse(element, { document }) {
  // Find the carousel root
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;

  // Find all carousel items (slides)
  const items = Array.from(content.querySelectorAll('.cmp-carousel__item'));
  if (!items.length) return;

  // Prepare table rows
  const headerRow = ['Carousel (carousel16)'];
  const rows = [headerRow];

  items.forEach((item) => {
    // First cell: image (mandatory)
    const img = item.querySelector('img');
    if (!img) return; // skip if no image
    // Second cell: text content (optional)
    const textElements = [];
    item.childNodes.forEach((node) => {
      if (node.nodeType === 1 && !node.querySelector('img')) {
        textElements.push(node.cloneNode(true));
      } else if (node.nodeType === 3 && node.textContent.trim()) {
        textElements.push(document.createTextNode(node.textContent));
      }
    });
    // Always push two columns: image, and text content (empty string if none)
    rows.push([img, textElements.length ? textElements : '']);
  });

  // Ensure every row after the header has exactly two columns (including empty text column)
  for (let i = 1; i < rows.length; i++) {
    if (rows[i].length === 1) rows[i].push('');
    if (rows[i].length > 2) rows[i] = rows[i].slice(0, 2);
  }

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace original element
  element.replaceWith(block);
}
