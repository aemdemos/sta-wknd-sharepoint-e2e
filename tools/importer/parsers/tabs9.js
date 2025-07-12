/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block (cmp-tabs)
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get the tab labels
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  const tabLabelElements = tabList ? Array.from(tabList.querySelectorAll('[role="tab"]')) : [];

  // Get tabpanel elements (in order)
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[role="tabpanel"]'));

  // Edge case: No tab labels or no tab panels
  if (!tabLabelElements.length || !tabPanels.length) return;

  // Build the table rows
  const rows = [];
  // Header row (exactly as required)
  rows.push(['Tabs (tabs9)']);
  // Tab label row: each label in its own column
  rows.push(tabLabelElements.map(lab => lab.textContent.trim()));
  // Tab content row: each content in its own column, referencing the actual HTML elements
  rows.push(tabPanels.map(panel => {
    // Try to find the main content inside .contentfragment
    const contentFragment = panel.querySelector('.contentfragment');
    if (contentFragment) {
      return contentFragment;
    } else {
      // If no .contentfragment, use all child nodes
      return Array.from(panel.childNodes);
    }
  }));

  // Create and replace with the table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  tabsBlock.replaceWith(block);
}
