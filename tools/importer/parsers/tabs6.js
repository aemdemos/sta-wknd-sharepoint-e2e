/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cmp-tabs block inside the element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Find tab label elements
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  const tabLabels = tabList ? Array.from(tabList.querySelectorAll('li[role="tab"]')) : [];

  // Find the tab panels (each tab content)
  const tabPanels = Array.from(tabs.querySelectorAll('.cmp-tabs__tabpanel'));
  const numTabs = Math.min(tabLabels.length, tabPanels.length);

  // Compose header row: single cell, exactly as required
  const headerRow = ['Tabs (tabs6)'];

  // Compose tab label row: each tab label as a bold element, all in separate columns
  const tabLabelRow = tabLabels.map(tab => {
    const b = document.createElement('b');
    b.textContent = tab.textContent.trim();
    return b;
  });

  // Compose each tab's content row: [tab label (plain), tab content]
  const contentRows = [];
  for (let i = 0; i < numTabs; i++) {
    // First cell is the tab label (plain text)
    const labelCell = tabLabels[i].textContent.trim();
    // Second cell is the tab content: either the main contentfragment/article, or all children
    const panel = tabPanels[i];
    let contentCell;
    const mainContent = panel.querySelector('.cmp-contentfragment, article');
    if (mainContent) {
      contentCell = mainContent;
    } else {
      // Use all child nodes (filter out empty text nodes)
      contentCell = Array.from(panel.childNodes).filter(n => (
        !(n.nodeType === Node.TEXT_NODE && !n.textContent.trim())
      ));
    }
    contentRows.push([labelCell, contentCell]);
  }

  // Build the table: header row, label row, then each content row
  const tableRows = [headerRow, tabLabelRow, ...contentRows];

  // Create table and replace the original tabs element
  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  tabs.replaceWith(block);
}
