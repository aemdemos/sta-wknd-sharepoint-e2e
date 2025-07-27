/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare table header as per spec
  const headerRow = ['Cards (cards21)'];
  const rows = [headerRow];

  // Find the <ul class="cmp-image-list">
  let imageListUl = element.querySelector('ul.cmp-image-list');
  if (!imageListUl) {
    // Sometimes wrapped in a .image-list div
    const listContainer = element.querySelector('.image-list');
    if (listContainer) {
      imageListUl = listContainer.querySelector('ul.cmp-image-list');
    }
  }
  if (!imageListUl) return;

  // Iterate each li card
  imageListUl.querySelectorAll(':scope > li.cmp-image-list__item').forEach((li) => {
    // Get image (first .cmp-image-list__item-image img)
    const img = li.querySelector('.cmp-image-list__item-image img');

    // Compose text cell content: title (bold), description (below)
    const titleEl = li.querySelector('.cmp-image-list__item-title');
    const descEl = li.querySelector('.cmp-image-list__item-description');

    const textCell = [];
    if (titleEl) {
      // Use <strong> for heading style
      const strong = document.createElement('strong');
      strong.textContent = titleEl.textContent.trim();
      textCell.push(strong);
      // Add br if description will follow
      if (descEl && descEl.textContent.trim()) {
        textCell.push(document.createElement('br'));
      }
    }
    if (descEl && descEl.textContent.trim()) {
      textCell.push(document.createTextNode(descEl.textContent.trim()));
    }

    rows.push([
      img,
      textCell
    ]);
  });

  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
