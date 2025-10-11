/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block by class or id
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Find the tab navigation (tab labels)
  const tablist = tabsBlock.querySelector('[role="tablist"], .cmp-tabs__tablist');
  if (!tablist) return;
  const tabLabels = Array.from(tablist.querySelectorAll('[role="tab"], .cmp-tabs__tab'));

  // Find all tab panels (tab content)
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[role="tabpanel"], .cmp-tabs__tabpanel'));

  // Defensive: ensure tabLabels and tabPanels are aligned
  if (tabLabels.length !== tabPanels.length) {
    return;
  }

  // Table header row (block name)
  const headerRow = ['Tabs (tabs12)'];
  const rows = [headerRow];

  // For each tab, extract label and content
  tabLabels.forEach((tabLabel, idx) => {
    // Tab label text
    const labelText = tabLabel.textContent.trim();
    // Tab panel content
    const panel = tabPanels[idx];
    if (!panel) return;

    // Use the panel element directly for content
    rows.push([
      labelText,
      panel
    ]);
  });

  // Create the block table
  const blockTable = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block with the new table
  tabsBlock.replaceWith(blockTable);
}
