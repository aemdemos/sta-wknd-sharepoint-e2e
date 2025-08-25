/* global WebImporter */
export default function parse(element, { document }) {
  // Table header matches exactly
  const headerRow = ['Cards (cards21)'];
  // Find the UL inside the image-list
  const ul = element.querySelector('ul.cmp-image-list');
  if (!ul) return;
  // Only use direct children LI elements
  const rows = Array.from(ul.children).filter(li => li.classList.contains('cmp-image-list__item')).map(li => {
    // Extract image
    const img = li.querySelector('img');
    // Compose the text cell
    const titleLink = li.querySelector('.cmp-image-list__item-title-link');
    const titleSpan = titleLink ? titleLink.querySelector('.cmp-image-list__item-title') : null;
    const descSpan = li.querySelector('.cmp-image-list__item-description');
    // Compose text cell: Title bold, then description (with line break only if both exist)
    const content = [];
    if (titleSpan) {
      // Use <strong> for heading, per example structure
      const strong = document.createElement('strong');
      strong.textContent = titleSpan.textContent;
      content.push(strong);
    }
    if (descSpan) {
      if (titleSpan) {
        content.push(document.createElement('br'));
      }
      content.push(descSpan);
    }
    // Always reference existing elements
    return [img, content];
  });
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);
  element.replaceWith(table);
}
