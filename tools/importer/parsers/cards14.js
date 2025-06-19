/* global WebImporter */
export default function parse(element, { document }) {
  // Header row must match exactly as in the example
  const headerRow = ['Cards (cards14)'];
  const cells = [headerRow];

  // Defensive: get the UL of cards, or fallback to any children that look like cards
  const list = element.querySelector('ul.cmp-image-list');
  if (list) {
    list.querySelectorAll('li.cmp-image-list__item').forEach(li => {
      // Get the image (first column)
      let imageEl = null;
      const imgLink = li.querySelector('.cmp-image-list__item-image-link');
      if (imgLink) {
        // Use the existing <img> element as-is
        imageEl = imgLink.querySelector('img');
      }

      // Get the text content (second column)
      // Title
      let titleEl = null;
      const titleLink = li.querySelector('.cmp-image-list__item-title-link');
      if (titleLink) {
        const span = titleLink.querySelector('.cmp-image-list__item-title');
        if (span) {
          // Use <strong> for visual heading (per example cards block)
          const strong = document.createElement('strong');
          strong.textContent = span.textContent;
          titleEl = strong;
        }
      }
      // Description
      const descEl = li.querySelector('.cmp-image-list__item-description');
      // Compose text cell: <strong>Title</strong><br>Description
      const textCell = [];
      if (titleEl) textCell.push(titleEl);
      if (descEl) {
        if (titleEl) textCell.push(document.createElement('br'));
        textCell.push(descEl);
      }
      // If neither, cell will be empty (edge case)
      cells.push([
        imageEl,
        textCell.length > 0 ? textCell : ''
      ]);
    });
  }
  // Create table and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
