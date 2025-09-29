/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block in the provided element
  const tabsContainer = element.querySelector('.tabs.panelcontainer');
  if (!tabsContainer) return;

  // Find the cmp-tabs inside the tabs block
  const cmpTabs = tabsContainer.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get the tab labels from the tablist
  const tabLabels = [];
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  if (tabList) {
    tabList.querySelectorAll('.cmp-tabs__tab').forEach(tab => {
      tabLabels.push(tab.textContent.trim());
    });
  }

  // Get the tab panels (content)
  const tabPanels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tabpanel'));

  // Defensive: ensure we have the same number of labels and panels
  const numTabs = Math.min(tabLabels.length, tabPanels.length);

  // Build the table rows
  const rows = [];
  // Header row as required
  const headerRow = ['Tabs (tabs19)'];
  rows.push(headerRow);

  // For each tab, add a row: [Label, Content]
  for (let i = 0; i < numTabs; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];

    // Find the main content fragment/article inside the panel
    let content = null;
    // Try to find the main content area
    const contentFragment = panel.querySelector('article') || panel.querySelector('.contentfragment');
    if (contentFragment) {
      content = contentFragment;
    } else {
      // fallback: use the whole panel
      content = panel;
    }

    rows.push([label, content]);
  }

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabsContainer with the new table
  tabsContainer.replaceWith(table);
}
