/* global WebImporter */
export default function parse(element, { document }) {
  // Only process the main tabs container
  if (!element || !element.classList.contains('cmp-tabs')) return;

  // Header row as required
  const headerRow = ['Tabs (tabs12)'];
  const rows = [headerRow];

  // Get tab labels from the tablist
  const tabList = element.querySelector('.cmp-tabs__tablist');
  const tabLabels = [];
  if (tabList) {
    tabList.querySelectorAll('li[role="tab"]').forEach(tab => {
      tabLabels.push(tab.textContent.trim());
    });
  }

  // Get all tab panels (order should match tabLabels)
  const tabPanels = Array.from(element.querySelectorAll('[role="tabpanel"]'));

  // Defensive: Only process as many panels as labels
  for (let i = 0; i < tabLabels.length && i < tabPanels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    // The tab content cell should include all visible content in the tab panel
    // We'll use the innerHTML as a fallback to ensure content is included
    let contentCell;
    const cf = panel.querySelector('.contentfragment');
    if (cf) {
      // Use all children of .contentfragment
      contentCell = Array.from(cf.children);
      if (contentCell.length === 0) {
        // fallback to the .contentfragment itself if empty
        contentCell = cf;
      }
    } else {
      // Use all children of the panel
      contentCell = Array.from(panel.children);
      if (contentCell.length === 0) {
        // fallback to the panel itself if empty
        contentCell = panel;
      }
    }
    rows.push([label, contentCell]);
  }

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(table);
}
