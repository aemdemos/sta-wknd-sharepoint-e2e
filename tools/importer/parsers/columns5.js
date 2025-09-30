/* global WebImporter */
export default function parse(element, { document }) {
  function findFooterGrid(el) {
    return el.querySelector('.aem-Grid.aem-Grid--12');
  }

  const grid = findFooterGrid(element);
  if (!grid) return;

  let logoCol, navCol, titleCol, socialCol;
  Array.from(grid.children).forEach((child) => {
    if (child.classList.contains('image')) logoCol = child;
    else if (child.classList.contains('navigation')) navCol = child;
    else if (child.classList.contains('title')) titleCol = child;
    else if (child.classList.contains('buildingblock')) socialCol = child;
  });

  let textCol = Array.from(grid.children).find((child) => child.classList.contains('text'));

  let titleSocialCell = [];
  if (titleCol) titleSocialCell.push(titleCol);
  if (socialCol) titleSocialCell.push(socialCol);

  let contentRow = [logoCol || '', navCol || '', titleSocialCell.length ? titleSocialCell : ''];
  if (!navCol) {
    contentRow = [logoCol || '', titleSocialCell.length ? titleSocialCell : ''];
  }

  // Only add info row if we have enough content to fill all columns
  // Otherwise, do not add a row with unnecessary empty columns
  const rows = [['Columns (columns5)'], contentRow];
  if (textCol) {
    // Only add info row if there's enough content to fill all columns
    if (contentRow.length === 1) {
      rows.push([textCol]);
    } else if (contentRow.length === 2) {
      // Try to split text between two columns if possible
      // If textCol contains multiple paragraphs, split them
      const paragraphs = textCol.querySelectorAll('p');
      if (paragraphs.length >= 2) {
        // Move first <p> to first col, rest to second col
        const first = document.createElement('div');
        first.appendChild(paragraphs[0].cloneNode(true));
        const second = document.createElement('div');
        for (let i = 1; i < paragraphs.length; i++) {
          second.appendChild(paragraphs[i].cloneNode(true));
        }
        rows.push([first, second]);
      } else {
        rows.push([textCol, '']);
      }
    } else if (contentRow.length === 3) {
      // Try to split text between three columns if possible
      const paragraphs = textCol.querySelectorAll('p');
      if (paragraphs.length >= 3) {
        const first = document.createElement('div');
        first.appendChild(paragraphs[0].cloneNode(true));
        const second = document.createElement('div');
        second.appendChild(paragraphs[1].cloneNode(true));
        const third = document.createElement('div');
        for (let i = 2; i < paragraphs.length; i++) {
          third.appendChild(paragraphs[i].cloneNode(true));
        }
        rows.push([first, second, third]);
      } else if (paragraphs.length === 2) {
        const first = document.createElement('div');
        first.appendChild(paragraphs[0].cloneNode(true));
        const second = document.createElement('div');
        second.appendChild(paragraphs[1].cloneNode(true));
        rows.push([first, second, '']);
      } else {
        rows.push([textCol, '', '']);
      }
    }
  }

  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
