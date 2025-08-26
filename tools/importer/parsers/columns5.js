/* global WebImporter */
export default function parse(element, { document }) {
  // Find the deepest .aem-Grid that contains the columns
  const mainGrid = element.querySelector('.aem-Grid.aem-Grid--12');
  if (!mainGrid) return;
  // Identify the 5 main logical columns
  // 1. Logo
  // 2. Navigation
  // 3. Social title
  // 4. Social buttons
  // 5. Footer text

  // Helper to get first child with a given class in mainGrid
  function colByClass(cls) {
    return mainGrid.querySelector(':scope > div.' + cls);
  }

  // 1. Logo column
  let logo = colByClass('image');
  let logoContent = '';
  if (logo) {
    const cmpImage = logo.querySelector('.cmp-image');
    if (cmpImage) logoContent = cmpImage;
  }

  // 2. Navigation column
  let nav = colByClass('navigation');
  let navContent = '';
  if (nav) {
    const navEl = nav.querySelector('nav');
    if (navEl) navContent = navEl;
  }

  // 3. Social title column
  let title = colByClass('title');
  let titleContent = '';
  if (title) {
    const cmpTitle = title.querySelector('.cmp-title');
    if (cmpTitle) titleContent = cmpTitle;
  }

  // 4. Social buttons (building block)
  let btnBlock = colByClass('cmp-buildingblock--btn-list');
  let btnListContent = '';
  if (btnBlock) {
    // get the inner .aem-Grid (the one with social link buttons)
    const btnGrid = btnBlock.querySelector('.aem-Grid');
    if (btnGrid) btnListContent = btnGrid;
  }

  // 5. Footer text (all .cmp-text in mainGrid)
  // There may be two: summary and copyright+disclaimer
  let textBlocks = Array.from(mainGrid.querySelectorAll(':scope > div.text .cmp-text'));
  let textContent = '';
  if (textBlocks.length > 0) {
    if (textBlocks.length === 1) {
      textContent = textBlocks[0];
    } else {
      // Wrap the text blocks in a div
      const wrapper = document.createElement('div');
      textBlocks.forEach(tb => wrapper.appendChild(tb));
      textContent = wrapper;
    }
  }

  // Build table
  const headerRow = ['Columns (columns5)'];
  const contentRow = [logoContent, navContent, titleContent, btnListContent, textContent];

  const cells = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
