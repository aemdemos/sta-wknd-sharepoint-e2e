/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Find the tab headers (li)
  const tabList = tabsRoot.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLis = Array.from(tabList.querySelectorAll('li'));

  // Determine the number of columns (always 2 for Tabs: label + content)
  const numCols = 2;

  // Prepare the table rows
  const cells = [];
  // Header row: single cell (spans two columns in render)
  cells.push(['Tabs (tabs20)']);

  // For each tab label, find its panel and content
  tabLis.forEach((li) => {
    const tabLabel = li.textContent.trim();
    const controlsId = li.getAttribute('aria-controls');
    if (!controlsId) return;
    const tabPanel = tabsRoot.querySelector(`#${controlsId}`);
    if (!tabPanel) return;

    // We'll refer to all meaningful (non-empty) children of the panel for content
    const contentElements = [];
    Array.from(tabPanel.children).forEach((child) => {
      // Ignore empty AEM grid wrappers
      if (
        child.children &&
        child.children.length === 1 &&
        child.firstElementChild &&
        child.firstElementChild.classList.contains('aem-Grid')
      ) {
        // skip
      } else if (
        child.children &&
        child.children.length === 0 &&
        child.textContent.trim() === ''
      ) {
        // skip empty divs
      } else {
        contentElements.push(child);
      }
    });
    // Fallback: if nothing, use all children
    let contentCell;
    if (contentElements.length === 0) {
      contentCell = Array.from(tabPanel.children);
    } else if (contentElements.length === 1) {
      contentCell = contentElements[0];
    } else {
      contentCell = contentElements;
    }
    // If still empty, fallback to the entire tabPanel
    if (
      (!contentCell || (Array.isArray(contentCell) && contentCell.length === 0)) &&
      tabPanel.textContent.trim() !== ''
    ) {
      contentCell = tabPanel;
    }
    cells.push([tabLabel, contentCell]);
  });

  // To ensure header row only has one cell, but content rows have two, we need to patch createTable's col count
  // We'll add empty cells to the header row so it matches the number of columns as the rest
  if (cells.length > 1 && cells[0].length < numCols) {
    while (cells[0].length < numCols) {
      cells[0].push('');
    }
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace original element
  element.replaceWith(block);
}
