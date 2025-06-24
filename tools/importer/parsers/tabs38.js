/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root (the .cmp-tabs element)
  const tabsWrapper = element.querySelector('.tabs .cmp-tabs');
  if (!tabsWrapper) return;

  // Find the tab list and tab labels
  const tabList = tabsWrapper.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabelEls = Array.from(tabList.querySelectorAll('[role="tab"]'));
  // Find all tabpanel elements in the .cmp-tabs
  const tabPanels = Array.from(tabsWrapper.querySelectorAll('.cmp-tabs__tabpanel'));
  // Defensive: if number of tabpanels doesn't match tabs, only process min length
  const rowCount = Math.min(tabLabelEls.length, tabPanels.length);

  // The block header row, exactly as specified
  const cells = [['Tabs (tabs38)']];

  // Build rows for each tab
  for (let i = 0; i < rowCount; i++) {
    const label = tabLabelEls[i].textContent.trim();
    const panel = tabPanels[i];
    // Reference the panel node directly (do not clone)
    cells.push([label, panel]);
  }

  // Create the tabs block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the tabs block with the new table
  tabsWrapper.replaceWith(table);
}
