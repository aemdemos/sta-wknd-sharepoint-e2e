/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get ordered tab labels (li[role=tab])
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  const tabEls = tabList ? Array.from(tabList.querySelectorAll('li[role="tab"]')) : [];

  // Get tab panels (div[role=tabpanel][data-cmp-hook-tabs=tabpanel])
  const tabPanels = Array.from(tabs.querySelectorAll('div[role="tabpanel"][data-cmp-hook-tabs="tabpanel"]'));

  // Must have same number of tabs and panels
  if (tabEls.length !== tabPanels.length || tabEls.length === 0) return;

  // Header row
  const cells = [['Tabs (tabs29)']];

  // Each tab: new row [label, content]
  for (let i = 0; i < tabEls.length; i++) {
    const strong = document.createElement('strong');
    strong.textContent = tabEls[i].textContent.trim();
    cells.push([strong, tabPanels[i]]);
  }

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
