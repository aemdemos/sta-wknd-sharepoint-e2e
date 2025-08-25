/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: two columns, second empty, first cell will get colspan=2 after table creation
  const headerRow = ['Cards (cards26)', ''];
  const cells = [headerRow];

  // Find all card items
  const items = element.querySelectorAll('ul.cmp-image-list > li.cmp-image-list__item');
  items.forEach((item) => {
    // Image cell
    let img = null;
    const imgLink = item.querySelector('.cmp-image-list__item-image-link');
    if (imgLink) {
      img = imgLink.querySelector('img');
    }
    let imageCell = img;
    // Text cell
    const titleLink = item.querySelector('.cmp-image-list__item-title-link');
    const titleSpan = titleLink ? titleLink.querySelector('.cmp-image-list__item-title') : null;
    const descriptionSpan = item.querySelector('.cmp-image-list__item-description');
    const textCellEls = [];
    if (titleSpan) {
      const strong = document.createElement('strong');
      strong.textContent = titleSpan.textContent;
      textCellEls.push(strong);
    }
    if (descriptionSpan) {
      const p = document.createElement('p');
      p.textContent = descriptionSpan.textContent;
      textCellEls.push(p);
    }
    cells.push([
      imageCell,
      textCellEls
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Fix the header row to span both columns
  if (table.rows.length > 0 && table.rows[0].cells.length === 2) {
    table.rows[0].cells[0].setAttribute('colspan', '2');
    // Remove the empty second cell for semantic cleanliness
    table.rows[0].deleteCell(1);
  }

  element.replaceWith(table);
}
