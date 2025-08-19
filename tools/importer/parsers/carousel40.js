/* global WebImporter */
export default function parse(element, { document }) {
  // Header row matches example
  const headerRow = ['Carousel (carousel40)'];

  // Prepare slide row content
  // 1st col: image only
  let imageEl = null;
  const imageBlock = element.querySelector('.cmp-teaser__image');
  if (imageBlock) {
    imageEl = imageBlock.querySelector('img');
  }

  // 2nd col: all text content (pretitle, title, desc, cta), preserving structure
  const contentBlock = element.querySelector('.cmp-teaser__content');
  let textContent = [];
  if (contentBlock) {
    // Use direct children to preserve order and structure, and avoid missing anything
    [...contentBlock.children].forEach(child => {
      // For title, ensure it's a heading (h2)
      if (child.classList.contains('cmp-teaser__title')) {
        const h2 = document.createElement('h2');
        h2.innerHTML = child.innerHTML;
        textContent.push(h2);
      } else if (child.classList.contains('cmp-teaser__action-container')) {
        // Get all links inside action container
        const links = child.querySelectorAll('a');
        links.forEach(link => textContent.push(link));
      } else {
        // For pretitle, description, etc, just push the element
        textContent.push(child);
      }
    });
  }

  // Edge case: if nothing found, put empty cell
  if (!imageEl) imageEl = '';
  if (textContent.length === 0) textContent = '';

  // Build table cells
  const cells = [headerRow, [imageEl, textContent]];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
