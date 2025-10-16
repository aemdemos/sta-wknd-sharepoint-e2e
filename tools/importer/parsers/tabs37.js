/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block (by class 'tabs' and 'cmp-tabs')
  const tabsContainer = element.querySelector('.tabs .cmp-tabs');
  if (!tabsContainer) return;

  // Get tab labels from tablist
  const tabList = tabsContainer.querySelector('.cmp-tabs__tablist');
  const tabLabels = Array.from(tabList ? tabList.children : []).map(li => li.textContent.trim());

  // Get tab panels (content)
  const tabPanels = Array.from(tabsContainer.querySelectorAll('[role="tabpanel"]'));

  // Defensive: ensure tabLabels and tabPanels match
  const tabCount = Math.min(tabLabels.length, tabPanels.length);

  // Table header
  const headerRow = ['Tabs (tabs37)'];
  const rows = [headerRow];

  // For each tab, add a row: [Tab Label, Tab Content]
  for (let i = 0; i < tabCount; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    // Defensive: If the panel is empty, skip
    if (!panel || !label) continue;
    // Use the panel content as-is (preserves images, lists, paragraphs, etc)
    rows.push([label, panel]);
  }

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original tabs block with the table
  tabsContainer.replaceWith(block);
}
