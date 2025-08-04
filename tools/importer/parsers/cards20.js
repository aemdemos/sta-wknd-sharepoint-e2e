/* global WebImporter */
export default function parse(element, { document }) {
  // Table header must be exactly as required
  const headerRow = ['Cards (cards20)'];
  const cells = [headerRow];

  const list = element.querySelector('ul.cmp-image-list');
  if (!list) return;
  const items = list.querySelectorAll(':scope > li.cmp-image-list__item');

  items.forEach((li) => {
    // Image cell: get <img> element
    let imgEl = li.querySelector('img');

    // Text cell: Title (bold/heading) and Description
    const content = li.querySelector('.cmp-image-list__item-content');
    let titleLink = content ? content.querySelector('.cmp-image-list__item-title-link') : null;
    let titleSpan = titleLink ? titleLink.querySelector('.cmp-image-list__item-title') : null;
    let desc = content ? content.querySelector('.cmp-image-list__item-description') : null;

    // Compose the text cell contents
    const textCell = [];
    if (titleSpan && titleSpan.textContent.trim()) {
      const strong = document.createElement('strong');
      strong.textContent = titleSpan.textContent.trim();
      textCell.push(strong);
    }
    if (desc && desc.textContent.trim()) {
      if (textCell.length > 0) {
        textCell.push(document.createElement('br'));
      }
      textCell.push(desc);
    }

    // If no image or no text, still insert null so cells match column count
    cells.push([
      imgEl || '',
      textCell.length ? textCell : ''
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
