/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs container in the provided element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get the tab labels (in ol[role=tablist] > li[role=tab])
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('[role="tab"]'));

  // Get all tab panels in order
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[role="tabpanel"]'));
  if (tabLabels.length === 0 || tabPanels.length === 0) return;

  // Build the table rows, first row is the block name
  const rows = [['Tabs (tabs7)']];

  // For each tab, add a row [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    if (!label || !panel) continue;
    // Use text content for tab label
    const tabLabelText = label.textContent.trim();
    // Reference the existing panel element directly
    rows.push([tabLabelText, panel]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the tabs block in the DOM
  tabsBlock.replaceWith(table);
}
