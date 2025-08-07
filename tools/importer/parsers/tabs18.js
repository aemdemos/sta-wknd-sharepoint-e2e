/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block within the given element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Find all tab labels
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  const tabLabels = [];
  if (tabList) {
    tabList.querySelectorAll('li').forEach(tab => {
      tabLabels.push(tab.textContent.trim());
    });
  }

  // Get all tabpanel elements (content for each tab)
  const tabPanels = tabs.querySelectorAll('[role="tabpanel"]');
  const tabContents = [];
  tabPanels.forEach(panel => {
    // For each tabpanel, find the first child that can be used as the content
    // In this markup, the .contentfragment is the meaningful content
    // We'll reference the direct .contentfragment child if present, else the whole panel
    const content = panel.querySelector('.contentfragment') || panel;
    tabContents.push(content);
  });

  // Build the block table rows
  // Header row: block name as a single cell
  const rows = [['Tabs (tabs18)']];
  // Each subsequent row: tab label, tab content
  for (let i = 0; i < tabLabels.length; i++) {
    rows.push([
      tabLabels[i],
      tabContents[i]
    ]);
  }

  // Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
