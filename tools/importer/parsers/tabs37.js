/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block in the source HTML
  const tabsContainer = element.querySelector('.tabs.panelcontainer');
  if (!tabsContainer) return;

  // Find the cmp-tabs element inside the tabs container
  const cmpTabs = tabsContainer.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get the tab labels from the tablist
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  const tabLabels = Array.from(tabList ? tabList.querySelectorAll('li[role="tab"]') : []);

  // Get all tab panels (tab content)
  const tabPanels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tabpanel'));

  // Defensive: Only proceed if we have labels and panels
  if (tabLabels.length === 0 || tabPanels.length === 0) return;

  // Build the table rows
  const headerRow = ['Tabs (tabs37)'];
  const rows = [headerRow];

  // For each tab, add a row: [Tab Label, Tab Content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    // Defensive: Tab content may be missing, so fallback to empty div
    const panel = tabPanels[i] || document.createElement('div');
    // Use the label text for the first cell
    // Use the full tab content (including nested elements) for the second cell
    rows.push([label.textContent.trim(), panel]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabsContainer with the block table
  tabsContainer.replaceWith(block);
}
