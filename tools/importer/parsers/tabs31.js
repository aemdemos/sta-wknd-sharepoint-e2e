/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block inside the given element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels from tablist, maintaining order
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  const tabLabels = tabList ? Array.from(tabList.children).map(
    (li) => li.textContent.trim()
  ) : [];

  // Get tab panels in the order they appear
  const tabPanels = Array.from(
    tabsBlock.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Prepare header row: block name and its variant (exact from example)
  const headerRow = ['Tabs (tabs31)'];

  // Build a table row for each tab: [label, content]
  const rows = tabPanels.map((panel, idx) => {
    // Use the label from tabLabels
    const label = tabLabels[idx] || `Tab ${idx+1}`;
    // Reference the panel directly (contains all tab content, including images)
    return [label, panel];
  });

  // Compose cells: header followed by all tab rows
  const cells = [headerRow, ...rows];

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original tabs block element with the block table
  tabsBlock.parentElement.replaceChild(block, tabsBlock);
}
