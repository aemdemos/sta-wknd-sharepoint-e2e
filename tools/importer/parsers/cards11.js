/* global WebImporter */
export default function parse(element, { document }) {
  // Find the innermost .aem-Grid that holds the card content
  const grids = element.querySelectorAll('.aem-Grid');
  let cardGrid = null;
  // The innermost .aem-Grid with multiple immediate children is likely our card grid
  for (const g of grids) {
    // Count only visible children that are not script/style
    const gridChildren = Array.from(g.children).filter(c => c.nodeType === 1 && c.tagName !== 'SCRIPT' && c.tagName !== 'STYLE');
    if (gridChildren.length >= 4) {
      cardGrid = g;
    }
  }
  if (!cardGrid) return;

  // Prepare table header
  const headerRow = ['Cards (cards11)'];
  const rows = [headerRow];

  // Card extraction: Logo, Navigation, Social (title+buttons), Copyright
  // 1. Logo Card
  const logoCol = cardGrid.querySelector('.cmp-image--logo .cmp-image');
  if (logoCol) {
    const img = logoCol.querySelector('img');
    let title = null;
    // The logo text is 'WKND', which is visually rendered with CSS, but not in text. Add from context.
    if (img && img.alt && img.alt.toLowerCase().includes('wknd')) {
      title = document.createElement('strong');
      title.textContent = img.alt.replace('Logo', '').trim(); // 'WKND'
    }
    // Compose the logo card (image + title)
    const cardContent = [];
    if (img) cardContent.push(logoCol);
    if (title) cardContent.push(document.createElement('br'), title);
    rows.push([cardContent, '']);
  }

  // 2. Navigation Card
  const navCol = cardGrid.querySelector('.cmp-navigation--footer nav');
  if (navCol) {
    rows.push(['', navCol]);
  }

  // 3. Social (Follow Us) Card: title + buttons
  const titleCol = cardGrid.querySelector('.cmp-title--right .cmp-title__text');
  const btnBlock = cardGrid.querySelector('.cmp-buildingblock--btn-list');
  if (titleCol && btnBlock) {
    const followCell = document.createElement('div');
    followCell.appendChild(titleCol);
    // All .cmp-button within btnBlock
    const btns = Array.from(btnBlock.querySelectorAll('.cmp-button'));
    btns.forEach(btn => followCell.appendChild(btn));
    rows.push(['', followCell]);
  }

  // 4. Copyright Card
  const copyrightCol = cardGrid.querySelector('.cmp-text');
  if (copyrightCol) {
    rows.push(['', copyrightCol]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
