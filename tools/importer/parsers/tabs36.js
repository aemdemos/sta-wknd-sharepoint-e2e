/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block by class 'tabs'
  const tabsBlock = element.querySelector('.tabs');
  if (!tabsBlock) return;

  // Inside the tabs block, find the .cmp-tabs element
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get the tablist - list of tab labels
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;

  // Get all tab <li>s and corresponding tabpanel ids
  const tabLis = Array.from(tabList.querySelectorAll('li'));
  const tabLabels = tabLis.map(li => li.textContent.trim());
  const tabIds = tabLis.map(li => li.getAttribute('aria-controls'));

  // Compose tab rows (each with 2 cells)
  const tabRows = tabLabels.map((label, idx) => {
    const tabId = tabIds[idx];
    const panel = tabId ? cmpTabs.querySelector(`#${tabId}`) : null;
    let contentCell = '';
    if (panel) {
      // Use all children as the content, excluding empty grid wrappers
      const realContent = [];
      for (const child of panel.children) {
        if (
          child.classList.contains('aem-Grid') &&
          child.childElementCount === 0
        ) {
          continue;
        }
        realContent.push(child);
      }
      if (realContent.length === 1) {
        contentCell = realContent[0];
      } else if (realContent.length > 1) {
        contentCell = realContent;
      } else {
        contentCell = panel; // fallback
      }
    }
    return [label, contentCell];
  });

  // The header row must have only one cell, matching the example
  const cells = [];
  cells.push(['Tabs (tabs36)']);
  // Add all tab rows (which have 2 columns)
  cells.push(...tabRows);

  // Compute the max number of columns for the table
  // This ensures the header row is a single cell <th> with colspan if needed
  const maxCols = Math.max(...cells.map(row => row.length));

  // If the header row has less columns, pad it with colspan
  if (cells[0].length < maxCols) {
    const th = document.createElement('th');
    th.innerHTML = cells[0][0];
    if (maxCols > 1) th.setAttribute('colspan', maxCols);
    // replace the header row with our custom th row
    cells[0] = [th];
  }

  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original tabs block with the table
  tabsBlock.replaceWith(table);
}
