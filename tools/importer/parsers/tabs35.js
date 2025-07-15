/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the tabs block
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // STEP 1: Get tab labels (order matters)
  const tabLabels = [];
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  if (tabList) {
    tabList.querySelectorAll('li[role="tab"]').forEach(tab => {
      tabLabels.push(tab.textContent.trim());
    });
  }

  // STEP 2: Get tab content elements in the same order as labels
  const tabPanels = Array.from(tabs.querySelectorAll('[role="tabpanel"]'));
  const tabContents = tabPanels.map(panel => {
    // Reference the main content/article for each panel if available, else the panel itself
    // Only reference, don't clone/modify
    const content = panel.querySelector('article') || panel;
    return content;
  });

  // STEP 3: Build the block table
  // Header row: block name, as per guidelines
  const headerRow = ['Tabs (tabs35)'];
  // Each row: [tab label, tab content element]
  const rows = [headerRow];
  for (let i = 0; i < tabLabels.length; i++) {
    // If this tab is missing content (should not happen), put empty string
    rows.push([
      tabLabels[i],
      tabContents[i] || ''
    ]);
  }

  // STEP 4: Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
