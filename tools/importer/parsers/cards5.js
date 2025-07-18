/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid in the footer area containing all main footer blocks.
  const layoutContainer = element.querySelector('.cmp-layoutcontainer--footer');
  if (!layoutContainer) return;
  const aemGrid = layoutContainer.querySelector('.aem-Grid');
  if (!aemGrid) return;

  // Get all immediate children of the grid
  const gridChildren = Array.from(aemGrid.children);

  // Helper to find the first child with a className (not deep)
  function getFirstByClass(array, className) {
    return array.find(el => el.classList && el.classList.contains(className));
  }
  // Helper to get all children containing a class (not deep)
  function getAllByClass(array, className) {
    return array.filter(el => el.classList && el.classList.contains(className));
  }

  // Card 1: Logo + Navigation
  const logoDiv = getFirstByClass(gridChildren, 'image');
  let logoCell = null;
  if (logoDiv) {
    const imgLink = logoDiv.querySelector('a');
    if (imgLink) {
      logoCell = imgLink;
    } else {
      const img = logoDiv.querySelector('img');
      if (img) {
        logoCell = img;
      }
    }
  }
  const navDiv = getFirstByClass(gridChildren, 'navigation');
  let navCell = null;
  if (navDiv) {
    const nav = navDiv.querySelector('nav');
    if (nav) navCell = nav;
  }

  // Card 2: Social title + social buttons
  const titleDiv = getFirstByClass(gridChildren, 'title');
  let socialTitle = null;
  if (titleDiv) {
    const titleContent = titleDiv.querySelector('.cmp-title');
    if (titleContent) socialTitle = titleContent;
  }
  const btnListDiv = getFirstByClass(gridChildren, 'cmp-buildingblock--btn-list');
  let btnGrid = null;
  if (btnListDiv) {
    btnGrid = btnListDiv.querySelector('.aem-Grid');
  }

  // Card 3/4: Footer description and copyright/about
  // Text blocks ('cmp-text' inside 'text' divs)
  const allTextDivs = getAllByClass(gridChildren, 'text');
  const textBlocks = allTextDivs.map(div => div.querySelector('.cmp-text')).filter(Boolean);
  let descBlock = textBlocks[0] || null;
  let copyrightBlock = textBlocks[1] || null;

  // Start building table rows
  const rows = [];
  // Header
  rows.push(['Cards (cards5)']);
  // Card 1: Logo + Navigation
  if (logoCell && navCell) {
    rows.push([logoCell, navCell]);
  }
  // Card 2: Social (Follow Us + social icons)
  if (socialTitle || btnGrid) {
    // It's OK to have a blank icon/image cell if none present
    const socialContent = [];
    if (socialTitle) socialContent.push(socialTitle);
    if (btnGrid) socialContent.push(btnGrid);
    rows.push(['', socialContent]);
  }
  // Card 3: Footer description
  if (descBlock) {
    rows.push(['', descBlock]);
  }
  // Card 4: Copyright/About
  if (copyrightBlock) {
    rows.push(['', copyrightBlock]);
  }

  // Final table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
