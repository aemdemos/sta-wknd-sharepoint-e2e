/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs block in the element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels from the tablist
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.children).map(tab => tab.textContent.trim());
  const numTabs = tabLabels.length;

  // Get the tab panel elements for each tab
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Header row: single cell
  const headerRow = ['Tabs (tabs15)'];
  // Tab label row: tab labels as column headers
  const labelRow = tabLabels;

  // Content rows: one row per tab, each with content ONLY in the cell for its tab, rest empty
  const contentRows = tabPanels.map((tabpanel, idx) => {
    // Prefer the .contentfragment in the tabpanel if present
    let tabContent;
    const contentFragment = tabpanel ? tabpanel.querySelector('.contentfragment') : null;
    if(contentFragment) {
      tabContent = contentFragment;
    } else if(tabpanel) {
      const children = Array.from(tabpanel.childNodes).filter(n => !(n.nodeType === Node.TEXT_NODE && !n.textContent.trim()));
      tabContent = children.length === 1 ? children[0] : children;
    } else {
      tabContent = '';
    }
    // Construct a row with all empty except the current tab index
    const row = Array(numTabs).fill('');
    row[idx] = tabContent;
    return row;
  });

  const cells = [headerRow, labelRow, ...contentRows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  tabsBlock.replaceWith(table);
}
