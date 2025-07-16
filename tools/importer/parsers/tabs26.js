/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block container
  const tabsBlock = element.querySelector('.tabs .cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels (li elements in tablist)
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('li[role="tab"]'));

  // Get all tab panels (in order)
  const tabPanels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tabpanel'));

  // Header row (exact block name)
  const headerRow = ['Tabs (tabs26)'];

  // Compose table rows for each tab
  const rows = [];
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    // Defensive: skip if missing label or panel
    if (!label || !panel) continue;
    // Use a <strong> element for the tab label as in the example
    const strong = document.createElement('strong');
    strong.textContent = label.textContent.trim();
    // Reference the panel element directly for tab content
    rows.push([strong, panel]);
  }

  // Compose the full cells array
  const cells = [headerRow, ...rows];

  // Create block table
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the entire tabs block with the new table
  tabsBlock.replaceWith(table);
}
