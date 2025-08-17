/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get tab labels from tablist
  const tabLabelElements = Array.from(
    tabs.querySelectorAll('.cmp-tabs__tablist > li[role="tab"]')
  );
  const tabLabels = tabLabelElements.map(tab => tab.textContent.trim());

  // Get tab panels (in order)
  const tabPanels = Array.from(tabs.querySelectorAll('.cmp-tabs__tabpanel'));

  // Table header row
  const headerRow = ['Tabs (tabs10)'];
  const rows = [headerRow];

  // For each tab, add a row with [Tab Label, Tab Content]
  for (let i = 0; i < tabLabels.length; i++) {
    const tabLabel = tabLabels[i];
    const tabPanel = tabPanels[i];
    if (!tabPanel) continue;

    // For tab content, use the actual existing top-level tabPanel as reference
    // This will include all content, including its document structure
    rows.push([tabLabel, tabPanel]);
  }

  // Create and replace with the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  tabs.replaceWith(table);
}
