/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cards21)'];
  const tableRows = [headerRow];

  // Locate list of cards
  const list = element.querySelector('ul.cmp-image-list');
  if (!list) return;
  const items = list.querySelectorAll(':scope > li.cmp-image-list__item');

  items.forEach(item => {
    // Get image element (reference, don't clone)
    let imgEl = null;
    const imgWrapper = item.querySelector('.cmp-image-list__item-image img');
    if (imgWrapper) imgEl = imgWrapper;

    // Find title and description
    let title = '';
    let titleLink = null;
    const titleLinkEl = item.querySelector('.cmp-image-list__item-title-link');
    if (titleLinkEl) {
      title = titleLinkEl.textContent.trim();
      titleLink = titleLinkEl;
    }
    let desc = '';
    const descEl = item.querySelector('.cmp-image-list__item-description');
    if (descEl) desc = descEl.textContent.trim();

    // Build text cell: title (strong, as a link), then description in <p>
    const textCellEls = [];
    if (title) {
      const strong = document.createElement('strong');
      if (titleLink && titleLink.href) {
        const link = document.createElement('a');
        link.href = titleLink.href;
        link.textContent = title;
        strong.appendChild(link);
      } else {
        strong.textContent = title;
      }
      textCellEls.push(strong);
    }
    if (desc) {
      const p = document.createElement('p');
      p.textContent = desc;
      textCellEls.push(p);
    }
    
    tableRows.push([
      imgEl,
      textCellEls.length === 1 ? textCellEls[0] : textCellEls
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
