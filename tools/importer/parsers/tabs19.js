/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block (the block with .tabs and .cmp-tabs)
  const tabsContainer = element.querySelector('.tabs');
  const cmpTabs = tabsContainer ? tabsContainer.querySelector('.cmp-tabs') : null;
  if (!cmpTabs) return;

  // Get tab labels in display order
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  const tabLabels = [];
  if (tabList) {
    tabList.querySelectorAll('.cmp-tabs__tab').forEach(tab => {
      tabLabels.push(tab.textContent.trim());
    });
  }

  // Get tab content in order
  // Find all tabpanel elements in the order they appear
  const tabPanels = [];
  cmpTabs.querySelectorAll('.cmp-tabs__tabpanel').forEach(panel => {
    // Prefer the main contentfragment/article inside the panel
    let mainContent = panel.querySelector('.contentfragment, article.cmp-contentfragment, .cmp-contentfragment');
    // If not found, fallback to panel itself
    tabPanels.push(mainContent ? mainContent : panel);
  });

  // Build the table rows
  const rows = [];
  // First row is always the block name
  rows.push(['Tabs (tabs19)']);

  // Each row is [Tab Label, Tab Content]
  for (let i = 0; i < tabLabels.length && i < tabPanels.length; i++) {
    rows.push([tabLabels[i], tabPanels[i]]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original tabs container with this table
  tabsContainer.replaceWith(table);
}
