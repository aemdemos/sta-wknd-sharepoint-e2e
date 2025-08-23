/* global WebImporter */
export default function parse(element, { document }) {
  // Find the deepest .aem-Grid with the columns we want
  let aemGrid = element.querySelector('.aem-Grid.aem-Grid--12');
  if (!aemGrid) {
    aemGrid = element.querySelector('.aem-Grid');
  }
  if (!aemGrid) return;

  // Get all immediate children that are .aem-GridColumn (each is a 'column')
  const columnDivs = Array.from(aemGrid.children).filter(child => child.classList.contains('aem-GridColumn'));

  // Find the key blocks by class
  // 1. Logo column
  const logoDiv = columnDivs.find(div => div.classList.contains('cmp-image--logo'));
  let logoContent = null;
  if (logoDiv) {
    const cmpImage = logoDiv.querySelector('.cmp-image');
    if (cmpImage) logoContent = cmpImage;
  }

  // 2. Navigation column
  const navDiv = columnDivs.find(div => div.classList.contains('cmp-navigation--footer'));
  let navContent = null;
  if (navDiv) {
    const nav = navDiv.querySelector('nav.cmp-navigation');
    if (nav) navContent = nav;
  }

  // 3. Follow Us title
  const titleDiv = columnDivs.find(div => div.classList.contains('cmp-title--right'));
  let titleContent = null;
  if (titleDiv) {
    const cmpTitle = titleDiv.querySelector('.cmp-title');
    if (cmpTitle) titleContent = cmpTitle;
  }

  // 4. Social buttons (button list)
  const btnListDiv = columnDivs.find(div => div.classList.contains('cmp-buildingblock--btn-list'));
  let btnContent = null;
  if (btnListDiv) {
    const btnGrid = btnListDiv.querySelector('.xf-master-building-block');
    if (btnGrid) btnContent = btnGrid;
  }

  // 5. The two small text blocks at the bottom (could be 1 or 2)
  // Each has class cmp-text--font-xsmall
  const textDivs = columnDivs.filter(div => div.classList.contains('cmp-text--font-xsmall'));
  let textContent = [];
  if (textDivs.length > 0) {
    textDivs.forEach(txtDiv => {
      const cmpText = txtDiv.querySelector('.cmp-text');
      if (cmpText) textContent.push(cmpText);
    });
  }
  // If only one, just use that
  if (textContent.length === 1) {
    textContent = textContent[0];
  }

  // Compose header and row for Columns (columns5)
  // The header row must span all columns, so we pass a single cell for the header row
  // and the content row as an array with every column's content.
  const headerRow = ['Columns (columns5)'];
  const contentRow = [logoContent, navContent, titleContent, btnContent, textContent];

  // Build the block table
  const cells = [headerRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Ensure header row is a single <th> spanning all columns
  if (block && block.rows.length > 1) {
    const headerTr = block.rows[0];
    if (headerTr && headerTr.cells.length === 1) {
      headerTr.cells[0].setAttribute('colspan', contentRow.length);
    }
  }

  // Replace original element
  element.replaceWith(block);
}
