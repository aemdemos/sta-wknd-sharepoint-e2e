/* global WebImporter */
export default function parse(element, { document }) {
  // The header row must be a single cell as in the example
  const headerRow = ['Cards (cards25)'];

  // Find the main UL containing the image list items
  const ul = element.querySelector('ul.cmp-image-list');
  if (!ul) return;

  // Get all LI items (cards)
  const items = Array.from(ul.querySelectorAll(':scope > li.cmp-image-list__item'));

  // Each row: [image element, text content]
  const rows = items.map((li) => {
    // --- Image cell (first column) ---
    let imageElem = null;
    const imgLink = li.querySelector('.cmp-image-list__item-image-link');
    if (imgLink) {
      imageElem = imgLink.querySelector('img'); // reference existing img
    }

    // --- Text content cell (second column) ---
    // Build content as [title, description]
    const textParts = [];
    // Title
    const titleLink = li.querySelector('.cmp-image-list__item-title-link');
    if (titleLink) {
      const titleSpan = titleLink.querySelector('.cmp-image-list__item-title');
      if (titleSpan && titleSpan.textContent.trim()) {
        const strong = document.createElement('strong');
        strong.textContent = titleSpan.textContent.trim();
        textParts.push(strong);
      }
    }
    // Description
    const descElem = li.querySelector('.cmp-image-list__item-description');
    if (descElem && descElem.textContent.trim()) {
      if (textParts.length > 0) {
        textParts.push(document.createElement('br'));
      }
      const span = document.createElement('span');
      span.textContent = descElem.textContent.trim();
      textParts.push(span);
    }
    return [imageElem, textParts];
  });

  // The final array passed to createTable must have one single-cell header row, then all card rows with 2 columns each
  const cells = [headerRow, ...rows];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
