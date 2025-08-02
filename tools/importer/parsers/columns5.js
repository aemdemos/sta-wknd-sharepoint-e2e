/* global WebImporter */
export default function parse(element, { document }) {
  // Find the deepest footer grid (aem-Grid.aem-Grid--12) within the element
  const grid = element.querySelector('.aem-Grid.aem-Grid--12');
  if (!grid) return;

  // Collect relevant content columns in logical display order:
  // 1. Logo
  // 2. Navigation links
  // 3. Follow Us heading
  // 4. Social buttons
  // 5. Footer text blocks (2 blocks)

  // Get all direct children of grid
  const gridChildren = Array.from(grid.children);

  // Helper to find by class substring
  function findByClass(substring) {
    return gridChildren.find(el => el.classList && el.classList.value.includes(substring));
  }
  function findAllByClass(substring) {
    return gridChildren.filter(el => el.classList && el.classList.value.includes(substring));
  }

  // 1. Logo block
  const logoBlock = findByClass('cmp-image--logo');

  // 2. Navigation
  const navBlock = findByClass('cmp-navigation--footer');

  // 3. Title
  const titleBlock = findByClass('cmp-title--white');

  // 4. Social buttons
  const socialBlock = findByClass('cmp-buildingblock--btn-list');

  // 5. Footer text blocks (there are always two, both .cmp-text--font-xsmall)
  const textBlocks = findAllByClass('cmp-text--font-xsmall');

  // Compose a container for all footer columns
  const containerDiv = document.createElement('div');
  if (logoBlock) containerDiv.appendChild(logoBlock);
  if (navBlock) containerDiv.appendChild(navBlock);
  if (titleBlock) containerDiv.appendChild(titleBlock);
  if (socialBlock) containerDiv.appendChild(socialBlock);
  textBlocks.forEach(tb => containerDiv.appendChild(tb));

  // Header row as required by the spec
  const headerRow = ['Columns (columns5)'];
  const bodyRow = [containerDiv];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    bodyRow,
  ], document);

  element.replaceWith(table);
}
