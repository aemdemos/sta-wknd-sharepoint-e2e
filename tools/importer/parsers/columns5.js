/* global WebImporter */
export default function parse(element, { document }) {
  // Find the innermost aem-Grid containing the actual footer columns
  function findInnermostGrid(el) {
    // Find all .aem-Grid elements
    let allGrids = Array.from(el.querySelectorAll('.aem-Grid'));
    // Prefer the one with the most direct children
    return allGrids.sort((a, b) => b.querySelectorAll(':scope > div').length - a.querySelectorAll(':scope > div').length)[0];
  }

  const innermostGrid = findInnermostGrid(element);
  if (!innermostGrid) return;
  const gridChildren = Array.from(innermostGrid.querySelectorAll(':scope > div'));

  // Extract columns by layout meaning: logo, navigation/text, follow us/buttons

  // 1. Logo column (left)
  const logoDiv = gridChildren.find(div => div.className.includes('cmp-image--logo'));
  let logoCell = '';
  if (logoDiv) {
    // Reference all its children so as to not miss any content (i.e. anchor/image)
    logoCell = Array.from(logoDiv.childNodes).filter(n => n.nodeType !== Node.TEXT_NODE || n.textContent.trim());
  }

  // 2. Navigation and text column (center)
  // Find the nav block
  const navDiv = gridChildren.find(div => div.className.includes('cmp-navigation--footer'));
  let navCellContent = [];
  if (navDiv) {
    // Include all its content, not just nav, in case of variations
    navCellContent = navCellContent.concat(Array.from(navDiv.childNodes).filter(n => n.nodeType !== Node.TEXT_NODE || n.textContent.trim()));
  }
  // After navigation, include all .cmp-separator and .cmp-text blocks (footer text)
  const navDivIdx = gridChildren.indexOf(navDiv);
  for (let i = navDivIdx + 1; i < gridChildren.length; i++) {
    const div = gridChildren[i];
    if (div.className.includes('cmp-separator') || div.className.includes('cmp-text')) {
      navCellContent = navCellContent.concat(Array.from(div.childNodes).filter(n => n.nodeType !== Node.TEXT_NODE || n.textContent.trim()));
    }
  }

  // 3. Follow us column (right) - title + button list
  const titleDiv = gridChildren.find(div => div.className.includes('cmp-title--right'));
  const btnlistDiv = gridChildren.find(div => div.className.includes('cmp-buildingblock--btn-list'));
  let followUsCell = [];
  if (titleDiv) followUsCell = followUsCell.concat(Array.from(titleDiv.childNodes).filter(n => n.nodeType !== Node.TEXT_NODE || n.textContent.trim()));
  if (btnlistDiv) followUsCell = followUsCell.concat(Array.from(btnlistDiv.childNodes).filter(n => n.nodeType !== Node.TEXT_NODE || n.textContent.trim()));

  // Compose the columns block
  const headerRow = ['Columns (columns5)'];
  const contentRow = [logoCell, navCellContent, followUsCell];
  const cells = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
