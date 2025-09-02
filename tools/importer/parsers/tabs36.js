/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Collect tab labels and corresponding panels
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  const tabLabels = Array.from(tabList.querySelectorAll('.cmp-tabs__tab'));

  // Panels: get all direct children of the tabs block that are role="tabpanel"
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Defensive check, if panels and labels differ in count
  const numRows = Math.min(tabLabels.length, tabPanels.length);

  const headerRow = ['Tabs (tabs36)'];
  const rows = [];
  for (let i = 0; i < numRows; i++) {
    // Tab label
    const label = tabLabels[i].textContent.trim();
    // Tab panel: find relevant content
    const panel = tabPanels[i];
    let content;
    // Prefer the .contentfragment, but fallback to panel itself if not present
    const contentFragment = panel.querySelector('.contentfragment');
    if (contentFragment) {
      content = contentFragment;
    } else {
      // If contentfragment missing, insert panel's children
      if (panel.children.length > 0) {
        content = Array.from(panel.children);
      } else {
        // If panel is empty, fallback to empty string
        content = '';
      }
    }
    rows.push([label, content]);
  }

  // Compose table data
  const tableData = [headerRow, ...rows];
  const blockTable = WebImporter.DOMUtils.createTable(tableData, document);

  // Replace tabs block element with the new table
  tabsBlock.replaceWith(blockTable);
}
