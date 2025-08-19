/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row matches the example exactly
  const headerRow = ['Columns (columns30)'];

  // 2. Find the two main columns: sidebar (left) and content (right)
  let leftCol = null;
  let rightCol = null;

  // Look for the grid with two primary columns: one with contentfragment/sidebar, one with tabs
  const outerGrids = element.querySelectorAll(':scope > div > div.aem-Grid');
  for (const grid of outerGrids) {
    const cols = Array.from(grid.children);
    for (const col of cols) {
      if (!leftCol && col.querySelector('.cmp-contentfragment')) {
        leftCol = col;
      }
      if (!rightCol && col.querySelector('.cmp-tabs')) {
        rightCol = col;
      }
    }
    if (leftCol && rightCol) break;
  }
  // Fallback: just get first two cols if above didn't work
  if (!leftCol || !rightCol) {
    const cols = element.querySelectorAll(':scope > div > div.aem-Grid > div');
    leftCol = leftCol || cols[0];
    rightCol = rightCol || cols[1];
  }

  // 3. Collect ALL existing children from leftCol (to keep all text, lists, headings, and share buttons)
  const leftContent = document.createElement('div');
  if (leftCol) {
    Array.from(leftCol.childNodes).forEach(node => {
      // Only append non-empty nodes
      if (node.nodeType === Node.TEXT_NODE && !node.textContent.trim()) return;
      leftContent.appendChild(node);
    });
  }

  // 4. For rightCol, only the Overview panel goes in row 2. Others go to extra rows.
  const rightContent = document.createElement('div');
  let overviewPanel = null;
  let otherPanels = [];
  if (rightCol) {
    const tabs = rightCol.querySelector('.cmp-tabs');
    if (tabs) {
      const tabPanels = Array.from(tabs.querySelectorAll('.cmp-tabs__tabpanel'));
      // Find the Overview panel (the one that is active, or tab text = 'Overview')
      let overviewIndex = 0;
      for (let i = 0; i < tabPanels.length; i++) {
        const panel = tabPanels[i];
        if (panel.classList.contains('cmp-tabs__tabpanel--active')) {
          overviewPanel = panel;
          overviewIndex = i;
          break;
        }
      }
      if (!overviewPanel && tabPanels.length > 0) {
        overviewPanel = tabPanels[0];
        overviewIndex = 0;
      }
      otherPanels = tabPanels.filter((_, i) => i !== overviewIndex);
    }
  }

  // Put all children of overviewPanel into rightContent
  if (overviewPanel) {
    Array.from(overviewPanel.childNodes).forEach(node => {
      if (node.nodeType === Node.TEXT_NODE && !node.textContent.trim()) return;
      rightContent.appendChild(node);
    });
  }

  // 5. Compose the main columns row
  const columnsRow = [leftContent, rightContent];

  // 6. For each other panel, create a new row ([ '', <panelContent> ])
  const additionalRows = [];
  otherPanels.forEach(panel => {
    const panelContent = document.createElement('div');
    Array.from(panel.childNodes).forEach(node => {
      if (node.nodeType === Node.TEXT_NODE && !node.textContent.trim()) return;
      panelContent.appendChild(node);
    });
    additionalRows.push(['', panelContent]);
  });

  // 7. Build the cells array according to the block spec
  const cells = [headerRow, columnsRow, ...additionalRows];

  // 8. Create the block table and replace the original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
