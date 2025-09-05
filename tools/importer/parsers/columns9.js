/* global WebImporter */
export default function parse(element, { document }) {
  // Find the deepest .aem-Grid containing the actual footer content
  let grid;
  const grids = element.querySelectorAll('.aem-Grid');
  if (grids.length) {
    grid = grids[grids.length - 1];
  } else {
    grid = element;
  }

  // Get all direct children of the grid (these are the columns visually)
  const columns = Array.from(grid.children);

  // --- COLUMN 1: WKND text (visually present in screenshot, not in HTML) ---
  let logoCell = '';
  const logoCol = columns.find(col => col.classList.contains('image'));
  if (logoCol) {
    // Get the <img> inside the logoCol
    const img = logoCol.querySelector('img');
    if (img) {
      // Compose WKND text (not in HTML, but visually present) and logo image
      const wkndDiv = document.createElement('div');
      const wkndText = document.createElement('span');
      wkndText.textContent = 'WKND';
      wkndText.style.fontWeight = 'bold';
      wkndText.style.fontSize = '2em';
      wkndDiv.appendChild(wkndText);
      wkndDiv.appendChild(document.createElement('br'));
      const logoImg = document.createElement('img');
      logoImg.src = img.src;
      logoImg.alt = img.alt || '';
      wkndDiv.appendChild(logoImg);
      logoCell = wkndDiv;
    }
  }

  // --- COLUMN 2: Text block (copyright + description) ---
  let textCell = '';
  const textCol = columns.find(col => col.classList.contains('text'));
  if (textCol) {
    const cmpText = textCol.querySelector('.cmp-text');
    if (cmpText) {
      // Clone all <p> and <a> inside
      const frag = document.createElement('div');
      Array.from(cmpText.childNodes).forEach(node => {
        frag.appendChild(node.cloneNode(true));
      });
      textCell = frag;
    }
  }

  // --- COLUMN 3: Follow Us + Social ---
  let socialCell = '';
  // Find title (Follow Us)
  const titleCol = columns.find(col => col.classList.contains('title'));
  let titleText = '';
  if (titleCol) {
    const h4 = titleCol.querySelector('h4');
    if (h4) {
      titleText = h4.textContent;
    }
  }
  // Find social buttons block
  const btnListCol = columns.find(col => col.classList.contains('cmp-buildingblock--btn-list'));
  if (btnListCol) {
    const btnLinks = btnListCol.querySelectorAll('a.cmp-button');
    if (btnLinks.length) {
      const btnFrag = document.createElement('div');
      if (titleText) {
        const strong = document.createElement('strong');
        strong.textContent = titleText;
        btnFrag.appendChild(strong);
      }
      btnLinks.forEach(a => {
        const btn = document.createElement('a');
        btn.href = a.href;
        btn.textContent = a.querySelector('.cmp-button__text')?.textContent || a.textContent;
        btnFrag.appendChild(btn);
      });
      socialCell = btnFrag;
    }
  }

  // Table header
  const headerRow = ['Columns (columns9)'];
  // Always output 3 columns for this block visually
  const firstRow = [logoCell, textCell, socialCell];

  // Build table
  const cells = [headerRow, firstRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the table
  element.replaceWith(table);
}
