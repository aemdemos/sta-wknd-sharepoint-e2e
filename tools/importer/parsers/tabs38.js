/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the tabs block within the given element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Header row for the block table
  const headerRow = ['Tabs (tabs38)'];
  const rows = [headerRow];

  // Get all tab labels (li elements)
  const tabLabels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get all tab panels (divs with role="tabpanel")
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[role="tabpanel"]'));

  // Defensive: Ensure tabLabels and tabPanels match
  const numTabs = Math.min(tabLabels.length, tabPanels.length);

  for (let i = 0; i < numTabs; i++) {
    // Tab label text
    const label = tabLabels[i].textContent.trim();
    // Tab content: reference the entire tabpanel div
    const content = tabPanels[i];
    rows.push([label, content]);
  }

  // Create the block table
  const blockTable = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original tabs block with the new table
  tabsBlock.replaceWith(blockTable);
}
