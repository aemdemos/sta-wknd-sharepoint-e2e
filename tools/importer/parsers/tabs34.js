/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs component
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get tab labels in order
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  const tabLabels = Array.from(tabList ? tabList.querySelectorAll('li') : []).map(li => li.textContent.trim());

  // Get all tab panels in order
  const tabPanels = Array.from(tabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Build the table structure
  const rows = [];
  // The header row must have exactly one column with the required header text
  rows.push(['Tabs (tabs34)']);

  // All tab rows must have exactly two cells: [Tab Label, Tab Content]
  for (let i = 0; i < tabLabels.length; i++) {
    const tabLabel = tabLabels[i];
    const tabPanel = tabPanels[i];
    if (!tabPanel) continue;
    // For robustness, reference the primary content inside the panel
    let content = null;
    // Try finding an article, or .contentfragment, or fallback to panel
    content = tabPanel.querySelector('article') || tabPanel.querySelector('.contentfragment') || tabPanel;
    rows.push([tabLabel, content]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element with the new table
  element.replaceWith(table);
}
