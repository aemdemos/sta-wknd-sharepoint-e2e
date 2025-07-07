/* global WebImporter */
export default function parse(element, { document }) {
  // Find left and right columns for the columns block
  // The left column is the inner responsivegrid (main.container.responsivegrid inside main),
  // The right column is the .tabs.panelcontainer

  // Find the inner responsivegrid for left panel
  let leftPanel = null;
  const innerGrids = element.querySelectorAll('main.container.responsivegrid > div > div.aem-Grid > main.container.responsivegrid');
  if (innerGrids.length > 0) {
    leftPanel = innerGrids[0];
  }

  // Find the right panel (tabs)
  const rightPanel = element.querySelector('div.tabs.panelcontainer');

  // Compose left column content
  let leftCells = [];
  if (leftPanel) {
    // In the left panel, get the .cmp-container > .aem-Grid > its children
    const grid = leftPanel.querySelector('div.cmp-container > div.aem-Grid');
    if (grid) {
      // Only select relevant children
      const items = Array.from(grid.children).filter(child =>
        child.classList.contains('contentfragment') ||
        child.classList.contains('title') ||
        child.classList.contains('sharing')
      );
      // Group share title and sharing together if both exist
      if (items.length >= 3) {
        const infoBlock = items[0];
        const shareTitle = items[1];
        const shareBtns = items[2];
        const shareBlock = document.createElement('div');
        shareBlock.appendChild(shareTitle);
        shareBlock.appendChild(shareBtns);
        leftCells = [infoBlock, shareBlock];
      } else if (items.length > 0) {
        leftCells = items;
      }
    }
  }

  // Compose the second column content (right panel)
  let rightCell = null;
  if (rightPanel) {
    rightCell = rightPanel;
  }

  // The block should have exactly two columns as per the example
  // Compose header row (block name and variant)
  const headerRow = ['Columns (columns37)', ''];
  // Compose content row
  const contentRow = [leftCells.length === 1 ? leftCells[0] : leftCells, rightCell];
  // Table cells
  const cells = [headerRow, contentRow];

  // Create and replace block
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
