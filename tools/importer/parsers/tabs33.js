/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block by class
  const tabsBlock = element.querySelector('.tabs');
  if (!tabsBlock) return;

  // Find the tabs component inside the block
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels from the tablist
  const tabLabels = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tablist > li[role="tab"]')
  ).map(tab => tab.textContent.trim());

  // Get tab panels (content)
  const tabPanels = Array.from(
    cmpTabs.querySelectorAll('[role="tabpanel"]')
  );

  // Defensive: Only keep as many panels as labels
  const tabRows = [];
  for (let i = 0; i < tabLabels.length && i < tabPanels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    // Defensive: If panel is empty, skip
    if (!panel) continue;
    // Use the entire tab panel content as the cell
    tabRows.push([label, panel]);
  }

  // Build the table cells array
  const cells = [
    ['Tabs (tabs33)'], // Header row
    ...tabRows
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original tabs block with the new table
  tabsBlock.replaceWith(block);
}
