/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsContainer = element.querySelector('.tabs.panelcontainer');
  if (!tabsContainer) return;

  // Find the tabs component inside the container
  const cmpTabs = tabsContainer.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get all tab labels
  const tabLabels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get all tab panels (content)
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Defensive: If no tabs or panels, abort
  if (!tabLabels.length || !tabPanels.length) return;

  // Table header row
  const headerRow = ['Tabs (tabs36)'];
  const rows = [headerRow];

  // For each tab, add a row: [Tab Label, Tab Content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    // Defensive: If no corresponding panel, skip
    if (!tabPanels[i]) continue;
    // Tab content: use the entire tabpanel div for resilience
    const content = tabPanels[i];
    rows.push([label, content]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block with the new table
  tabsContainer.replaceWith(block);
}
