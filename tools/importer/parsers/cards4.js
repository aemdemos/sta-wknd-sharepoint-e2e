/* global WebImporter */
export default function parse(element, { document }) {
  // Find the image list block (the cards grid)
  const imageList = element.querySelector('.image-list ul.cmp-image-list');
  if (!imageList) return;

  // Gather all card rows in advance to determine correct column count
  const cardRows = [];
  imageList.querySelectorAll(':scope > li.cmp-image-list__item').forEach((li) => {
    // Image cell
    let imageCell = '';
    const imgDiv = li.querySelector('.cmp-image-list__item-image');
    if (imgDiv) {
      imageCell = imgDiv;
    } else {
      const img = li.querySelector('img');
      if (img) imageCell = img;
    }
    // Text cell
    const content = li.querySelector('.cmp-image-list__item-content');
    let textCell = [];
    if (content) {
      // Title
      const title = content.querySelector('.cmp-image-list__item-title');
      if (title) {
        const strong = document.createElement('strong');
        strong.textContent = title.textContent.trim();
        textCell.push(strong);
        textCell.push(document.createElement('br'));
      }
      // Description
      const desc = content.querySelector('.cmp-image-list__item-description');
      if (desc) {
        textCell.push(desc);
        textCell.push(document.createElement('br'));
      }
      // Remove trailing <br>
      if (textCell.length && textCell[textCell.length-1].tagName === 'BR') {
        textCell.pop();
      }
      // Fallback: if textCell is empty, push all children except image
      if (textCell.length === 0) {
        Array.from(content.childNodes).forEach((node) => {
          if (!(node.nodeType === 1 && node.classList.contains('cmp-image-list__item-image'))) {
            textCell.push(node);
          }
        });
      }
    }
    cardRows.push([
      imageCell,
      textCell.length === 1 ? textCell[0] : textCell
    ]);
  });

  // Calculate max columns from cardRows
  let maxColumns = 1;
  cardRows.forEach(row => {
    if (Array.isArray(row)) {
      maxColumns = Math.max(maxColumns, row.length);
    }
  });

  // Header row: one cell only, must span all columns
  const headerRow = ['Cards (cards4)'];
  // If more than 1 column, fill with empty cells to match col count
  while (headerRow.length < maxColumns) {
    headerRow.push('');
  }

  const rows = [headerRow, ...cardRows];

  // Build and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
