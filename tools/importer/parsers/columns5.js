/* global WebImporter */
export default function parse(element, { document }) {
  // Find the deepest .aem-Grid.aem-Grid--12 containing the useful content
  let grid = element.querySelector('.aem-Grid.aem-Grid--12');
  if (!grid) grid = element;
  const children = Array.from(grid.children);

  // Identify content pieces
  const logoDiv = children.find(el => el.classList.contains('image'));
  const navDiv = children.find(el => el.classList.contains('navigation'));
  const titleDiv = children.find(el => el.classList.contains('title'));
  const buildingBlockDiv = children.find(el => el.classList.contains('buildingblock'));
  const textDivs = children.filter(el => el.classList.contains('text'));

  // Row 1: left = logo, right = title + social buttons
  let logo = null;
  if (logoDiv) {
    logo = logoDiv.querySelector('[data-cmp-is="image"]') || logoDiv;
  }
  let titleAndButtons = [];
  if (titleDiv) {
    const cmpTitle = titleDiv.querySelector('.cmp-title');
    if (cmpTitle) titleAndButtons.push(cmpTitle);
  }
  if (buildingBlockDiv) {
    const buttonsGrid = buildingBlockDiv.querySelector('.aem-Grid') || buildingBlockDiv;
    titleAndButtons.push(buttonsGrid);
  }

  // Row 2: left = nav, right = all text blocks
  let nav = null;
  if (navDiv) {
    nav = navDiv.querySelector('nav') || navDiv;
  }
  let texts = textDivs.map(div => div.querySelector('.cmp-text') || div).filter(Boolean);

  // Compose table: header row, then two rows with two columns each
  const headerRow = ['Columns (columns5)'];
  const row1 = [logo || '', titleAndButtons.length ? titleAndButtons : ''];
  const row2 = [nav || '', texts.length ? texts : ''];

  const cells = [
    headerRow,
    row1,
    row2
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
