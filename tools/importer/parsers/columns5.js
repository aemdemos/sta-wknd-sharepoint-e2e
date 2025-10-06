/* global WebImporter */
export default function parse(element, { document }) {
  // Find the deepest grid containing the footer layout
  let grid;
  const containers = element.querySelectorAll('.aem-Grid');
  for (const c of containers) {
    if (c.querySelector('.cmp-image, .cmp-navigation, .cmp-title, .cmp-buildingblock, .cmp-separator, .cmp-text')) {
      grid = c;
      break;
    }
  }
  if (!grid) return;

  // Get direct children of the grid
  const gridChildren = Array.from(grid.children);

  // Find logo image block
  const logoDiv = gridChildren.find((el) => el.classList.contains('cmp-image'));
  let logoImg = '';
  if (logoDiv) {
    const imageBlock = logoDiv.querySelector('div[data-cmp-is="image"]');
    if (imageBlock) logoImg = imageBlock.cloneNode(true);
  }

  // Find navigation block
  const navDiv = gridChildren.find((el) => el.classList.contains('cmp-navigation'));
  let nav = '';
  if (navDiv) {
    const navBlock = navDiv.querySelector('nav');
    if (navBlock) nav = navBlock.cloneNode(true);
  }

  // Find title block ("Follow Us")
  const titleDiv = gridChildren.find((el) => el.classList.contains('cmp-title'));
  let title = '';
  if (titleDiv) {
    title = titleDiv.cloneNode(true);
  }

  // Find social buttons block
  const btnListDiv = gridChildren.find((el) => el.classList.contains('cmp-buildingblock--btn-list'));
  let btns = [];
  if (btnListDiv) {
    const btnGrid = btnListDiv.querySelector('.aem-Grid');
    if (btnGrid) {
      // Each button is a child div with class 'button'
      btns = Array.from(btnGrid.children).filter((el) => el.classList.contains('button')).map(btn => btn.cloneNode(true));
    }
  }

  // Find separator (hr)
  const separatorDiv = gridChildren.find((el) => el.classList.contains('cmp-separator'));
  let separator = '';
  if (separatorDiv) {
    separator = separatorDiv.querySelector('hr') ? separatorDiv.querySelector('hr').cloneNode(true) : '';
  }

  // Find text blocks (there are two)
  const textDivs = gridChildren.filter((el) => el.classList.contains('cmp-text'));
  let text1 = '', text2 = '';
  if (textDivs.length > 0) {
    text1 = textDivs[0].cloneNode(true);
    if (textDivs.length > 1) {
      text2 = textDivs[1].cloneNode(true);
    }
  }

  // Compose table rows
  const headerRow = ['Columns (columns5)'];

  // Compose columns based on visual structure: logo, nav, social, text
  const cols = [];
  if (logoImg) cols.push(logoImg);
  if (nav) cols.push(nav);
  // Social column: title + each button in its own column
  if (title) cols.push(title);
  btns.forEach(btn => cols.push(btn));
  // Text column: separator + text1 + text2
  if (separator || text1 || text2) {
    const textCol = document.createElement('div');
    if (separator) textCol.appendChild(separator);
    if (text1) {
      const inner1 = text1.querySelector('div') ? text1.querySelector('div') : text1;
      textCol.appendChild(inner1.cloneNode(true));
    }
    if (text2) {
      const inner2 = text2.querySelector('div') ? text2.querySelector('div') : text2;
      textCol.appendChild(inner2.cloneNode(true));
    }
    cols.push(textCol);
  }

  const cells = [headerRow, cols];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(block);
}
