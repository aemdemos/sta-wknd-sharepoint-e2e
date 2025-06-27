/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get all tab labels
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  const tabLabels = [];
  if (tabList) {
    tabList.querySelectorAll('li[role="tab"]').forEach(tab => {
      tabLabels.push(tab.textContent.trim());
    });
  }

  // Get all tab panels (tab content)
  const tabPanels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tabpanel'));
  if (!tabLabels.length || !tabPanels.length) return;

  // Build the rows: header + one row per tab (label, content)
  const headerRow = ['Tabs (tabs8)'];
  const tabRows = tabLabels.map((label, i) => {
    const panel = tabPanels[i];
    // Find the main content for the tab (prefer article, then .contentfragment, then panel itself)
    let contentElem = panel && (panel.querySelector('article.cmp-contentfragment')
      || panel.querySelector('.contentfragment')
      || panel);
    return [label, contentElem];
  });

  const cells = [headerRow, ...tabRows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  tabsBlock.replaceWith(table);
}
