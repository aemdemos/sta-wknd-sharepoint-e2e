/* global WebImporter */
export default function parse(element, { document }) {
  // Find the deepest .aem-Grid with content
  let contentGrid = null;
  const grids = element.querySelectorAll('.aem-Grid');
  if (grids.length) {
    contentGrid = grids[grids.length - 1];
  } else {
    contentGrid = element;
  }

  // --- COLUMN 1: Logo ---
  let logoCell = '';
  const logoEl = contentGrid.querySelector('.cmp-image');
  if (logoEl) {
    // Use the outer HTML so all image content is preserved
    const logoDiv = document.createElement('div');
    logoDiv.innerHTML = logoEl.outerHTML;
    logoCell = logoDiv;
  }

  // --- COLUMN 2: Navigation ---
  let navCell = '';
  const navEl = contentGrid.querySelector('.cmp-navigation');
  if (navEl) {
    const navDiv = document.createElement('div');
    navDiv.innerHTML = navEl.outerHTML;
    navCell = navDiv;
  }

  // --- COLUMN 3: Follow Us (title + social buttons) ---
  let followUsCell = '';
  const followTitleEl = contentGrid.querySelector('.cmp-title');
  const socialBtnsEl = contentGrid.querySelector('.cmp-buildingblock--btn-list');
  if (followTitleEl || socialBtnsEl) {
    const wrapper = document.createElement('div');
    if (followTitleEl) wrapper.innerHTML += followTitleEl.outerHTML;
    if (socialBtnsEl) wrapper.innerHTML += socialBtnsEl.outerHTML;
    followUsCell = wrapper;
  }

  // --- FULL WIDTH TEXT BLOCK ---
  let textCell = '';
  const textBlocks = Array.from(contentGrid.querySelectorAll('.cmp-text'));
  if (textBlocks.length) {
    const wrapper = document.createElement('div');
    textBlocks.forEach(el => {
      wrapper.innerHTML += el.outerHTML;
    });
    textCell = wrapper;
  }

  // Compose the table: header, 3 columns, then full-width text
  const headerRow = ['Columns (columns5)'];
  const secondRow = [logoCell, navCell, followUsCell];
  const thirdRow = [textCell];
  const cells = [headerRow, secondRow, thirdRow];

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
