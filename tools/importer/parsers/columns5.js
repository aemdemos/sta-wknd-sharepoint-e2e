/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main .aem-Grid--12 grid (the deepest in the markup)
  const allGrids = element.querySelectorAll('.aem-Grid.aem-Grid--12');
  if (!allGrids.length) return;
  const grid = allGrids[allGrids.length - 1];
  if (!grid) return;
  
  // Get all direct child columns
  const colElems = Array.from(grid.children);

  // 1: Logo (image)
  const logoCol = colElems.find(el => el.classList.contains('cmp-image--logo'));
  const logo = logoCol ? logoCol.querySelector('[data-cmp-is="image"]') : null;

  // 2: Navigation
  const navCol = colElems.find(el => el.classList.contains('cmp-navigation--footer'));
  const nav = navCol ? navCol.querySelector('.cmp-navigation') : null;

  // 3: Title (Follow Us)
  const titleCol = colElems.find(el => el.classList.contains('cmp-title--right'));
  const followTitle = titleCol ? titleCol.querySelector('.cmp-title') : null;

  // 4: Social buttons
  const socialCol = colElems.find(el => el.classList.contains('cmp-buildingblock--btn-list'));
  const socialBtns = socialCol ? socialCol.querySelector('.aem-Grid') : null;

  // 5+: Text blocks (may be 2: one short, one long)
  const textBlocks = colElems
    .filter(el => el.classList.contains('cmp-text--font-xsmall'))
    .map(el => el.querySelector('.cmp-text'));

  // Compose each column as per the semantic grouping in the footer
  // Column 1: Left side (logo + nav)
  const leftCol = document.createElement('div');
  if (logo) leftCol.appendChild(logo);
  if (nav) leftCol.appendChild(nav);

  // Column 2: Right side (Follow Us + social + all footer text)
  const rightCol = document.createElement('div');
  if (followTitle) rightCol.appendChild(followTitle);
  if (socialBtns) rightCol.appendChild(socialBtns);
  textBlocks.forEach(tb => { if (tb) rightCol.appendChild(tb); });

  // Columns block header must match: 'Columns (columns5)'
  const cells = [
    ['Columns (columns5)'],
    [leftCol, rightCol],
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
