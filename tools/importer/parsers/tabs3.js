/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cmp-tabs block
  const tabsContainer = element.querySelector('.cmp-tabs');
  if (!tabsContainer) return;

  // Extract tab labels
  const tabList = tabsContainer.querySelector('.cmp-tabs__tablist');
  let tabLabels = [];
  if (tabList) {
    tabLabels = Array.from(tabList.querySelectorAll('.cmp-tabs__tab')).map(tab => tab.textContent.trim());
  }

  // Extract tab panel contents
  const tabPanels = tabsContainer.querySelectorAll('.cmp-tabs__tabpanel');
  const tabContents = Array.from(tabPanels).map(panel => {
    const article = panel.querySelector('article');
    return article ? article : panel;
  });

  // Fix: Table must be one row for header, one for all labels, one for all contents
  const cells = [
    ['Tabs (tabs3)'],
    tabLabels,
    tabContents
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  tabsContainer.replaceWith(table);
}
