/* global WebImporter */
export default function parse(element, { document }) {
  // Header row exactly as in the example
  const headerRow = ['Cards (cards14)'];
  const cells = [headerRow];

  // Find all card items (li elements)
  const items = element.querySelectorAll('ul.cmp-image-list > li.cmp-image-list__item');
  items.forEach((item) => {
    // First cell: the image
    let imageCell = null;
    const imgContainer = item.querySelector('.cmp-image-list__item-image');
    if (imgContainer) {
      // Prefer the <img>, fallback to the container
      const img = imgContainer.querySelector('img');
      imageCell = img ? img : imgContainer;
    }
    // If no image at all, add empty cell
    if (!imageCell) imageCell = '';

    // Second cell: text content
    // Title as heading (strong)
    let titleEl = null;
    const titleLink = item.querySelector('.cmp-image-list__item-title-link');
    if (titleLink) {
      const titleSpan = titleLink.querySelector('.cmp-image-list__item-title');
      if (titleSpan) {
        titleEl = document.createElement('strong');
        titleEl.textContent = titleSpan.textContent.trim();
      }
    }
    // Description
    let descEl = null;
    const desc = item.querySelector('.cmp-image-list__item-description');
    if (desc && desc.textContent.trim()) {
      descEl = document.createElement('span');
      descEl.textContent = desc.textContent.trim();
    }
    // Compose text cell, keeping elements referenced from the document when possible
    const textCell = [];
    if (titleEl) textCell.push(titleEl);
    if (descEl) {
      if (titleEl) textCell.push(document.createElement('br'));
      textCell.push(descEl);
    }

    cells.push([imageCell, textCell.length ? textCell : '']);
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
