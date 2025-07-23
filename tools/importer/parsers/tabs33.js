/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block by searching for .cmp-tabs inside the current element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get all tab labels
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  const tabLabels = tabList ? Array.from(tabList.querySelectorAll('[role="tab"]')).map(tab => tab.textContent.trim()) : [];

  // Get all tab panels - order should match tab labels
  const tabPanels = Array.from(
    tabs.querySelectorAll('[role="tabpanel"][data-cmp-hook-tabs="tabpanel"]')
  );

  // Defensive: if no tab labels or tab panels, don't continue
  if (tabLabels.length === 0 || tabPanels.length === 0) return;

  // Build the rows:
  // First row: block name as a single cell
  const rows = [
    ['Tabs (tabs33)'],
    // Second row: all tab labels, each in its own cell
    tabLabels
  ];

  // Third row: all tab contents, each in its own cell
  // For each panel, put the entire main content in the cell, referencing the existing element
  // Try to find the .contentfragment (which wraps all meaningful tab content) within each panel; fallback to panel itself
  const tabContents = tabPanels.map(panel => {
    // Get the main content inside each tab (usually a contentfragment)
    const contentFragment = panel.querySelector('article.cmp-contentfragment');
    if (contentFragment) return contentFragment;
    // Fallback: use the panel itself
    return panel;
  });
  rows.push(tabContents);

  // Create the table using the helper and replace the original element
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
