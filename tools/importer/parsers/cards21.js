/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as specified by the block
  const headerRow = ['Cards (cards21)'];
  // Find the card list container
  const list = element.querySelector('.cmp-image-list');
  if (!list) return;
  // Gather all card items
  const items = list.querySelectorAll(':scope > li.cmp-image-list__item');
  const rows = [headerRow];
  items.forEach(item => {
    // Find image element for first cell
    const image = item.querySelector('.cmp-image-list__item-image .cmp-image img');
    // Second cell will contain title (bold), then description (plain text)
    const titleLink = item.querySelector('.cmp-image-list__item-title-link');
    const titleEl = titleLink ? titleLink.querySelector('.cmp-image-list__item-title') : null;
    const descriptionEl = item.querySelector('.cmp-image-list__item-description');
    const textCellContent = [];
    if (titleEl) {
      const strong = document.createElement('strong');
      strong.textContent = titleEl.textContent;
      textCellContent.push(strong);
    }
    if (descriptionEl && descriptionEl.textContent.trim()) {
      if (textCellContent.length > 0) textCellContent.push(document.createElement('br'));
      textCellContent.push(document.createTextNode(descriptionEl.textContent.trim()));
    }
    rows.push([
      image,
      textCellContent.length ? textCellContent : ''
    ]);
  });
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
