/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Get the hero image (background image) - first prominent image at the top
  let heroImgBlock = null;
  const mainGrid = element.querySelector(':scope > div > .aem-Grid');
  if (mainGrid) {
    const heroImgDiv = Array.from(mainGrid.children)
      .find(el => el.classList && el.classList.contains('image'));
    if (heroImgDiv) {
      heroImgBlock = heroImgDiv.querySelector('.cmp-image');
    }
  }

  // 2. Get only the first two .title blocks (main heading & subheading) for the hero text
  let heroTextContent = [];
  let contentMain = null;
  const contentMains = element.querySelectorAll('main.container');
  contentMain = Array.from(contentMains).find(m => m.classList.contains('aem-GridColumn--default--8'));
  if (contentMain) {
    const cmpContainer = contentMain.querySelector(':scope > div');
    if (cmpContainer) {
      const titleBlocks = Array.from(cmpContainer.children)
        .filter(child => child.classList && child.classList.contains('title'));
      // Only add the first two title blocks
      if (titleBlocks[0]) heroTextContent.push(titleBlocks[0]);
      if (titleBlocks[1]) heroTextContent.push(titleBlocks[1]);
    }
  }

  // 3. Build table rows
  const headerRow = ['Hero (hero29)'];
  const imgRow = [heroImgBlock ? heroImgBlock : ''];
  const textRow = [heroTextContent.length ? heroTextContent : ''];
  // 4. Create table and replace element
  const cells = [headerRow, imgRow, textRow];
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(blockTable);
}
