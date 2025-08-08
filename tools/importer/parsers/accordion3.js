/* global WebImporter */
export default function parse(element, { document }) {
  // Find the accordion block
  const accordion = element.querySelector('.cmp-accordion');
  if (!accordion) return;

  // Header row: single cell, as per example
  const headerRow = ['Accordion (accordion3)'];
  const rows = [headerRow];

  // Collect all accordion items
  const items = accordion.querySelectorAll('.cmp-accordion__item');
  items.forEach(item => {
    // Title cell: use the visible text from .cmp-accordion__title
    let titleCell;
    const titleSpan = item.querySelector('.cmp-accordion__title');
    if (titleSpan) {
      titleCell = titleSpan;
    } else {
      const btn = item.querySelector('button');
      if (btn) {
        const strong = document.createElement('strong');
        strong.textContent = btn.textContent.trim();
        titleCell = strong;
      } else {
        titleCell = '';
      }
    }
    // Content cell: get the content of the panel
    let contentCell = '';
    const panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    if (panel) {
      const cmpContainer = panel.querySelector('.cmp-container');
      if (cmpContainer) {
        const textBlocks = cmpContainer.querySelectorAll('.cmp-text');
        if (textBlocks.length) {
          contentCell = Array.from(textBlocks);
        } else {
          contentCell = Array.from(cmpContainer.childNodes).filter(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              return node.textContent.trim();
            }
            if (node.nodeType === Node.TEXT_NODE) {
              return node.textContent.trim();
            }
            return false;
          });
          if (contentCell.length === 1) contentCell = contentCell[0];
        }
      } else {
        contentCell = Array.from(panel.childNodes).filter(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            return node.textContent.trim();
          }
          if (node.nodeType === Node.TEXT_NODE) {
            return node.textContent.trim();
          }
          return false;
        });
        if (contentCell.length === 1) contentCell = contentCell[0];
      }
    }
    rows.push([titleCell, contentCell]);
  });

  // Create the table with a special header row (1 cell) and subsequent rows with 2 cells
  const table = document.createElement('table');
  // Header row: 1 cell spanning 2 columns
  const trHeader = document.createElement('tr');
  const th = document.createElement('th');
  th.textContent = headerRow[0];
  th.colSpan = '2';
  trHeader.appendChild(th);
  table.appendChild(trHeader);
  // Add the content rows (each with 2 cells)
  for (let i = 1; i < rows.length; i++) {
    const tr = document.createElement('tr');
    const cells = rows[i];
    for (let j = 0; j < 2; j++) {
      const td = document.createElement('td');
      const cell = cells[j];
      if (Array.isArray(cell)) {
        td.append(...cell);
      } else if (cell instanceof Node) {
        td.append(cell);
      } else {
        td.innerHTML = cell || '';
      }
      tr.appendChild(td);
    }
    table.appendChild(tr);
  }
  // Replace the accordion element with the new table
  accordion.replaceWith(table);
}
