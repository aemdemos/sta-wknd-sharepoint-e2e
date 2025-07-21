/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block inside the element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels (the list of tabs)
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  const tabLis = tabList ? Array.from(tabList.querySelectorAll('li')) : [];

  // Get all tab panels (the tab content containers)
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Compose cells: first row is header, remaining rows are [label, content]
  const cells = [
    ['Tabs (tabs12)'],
  ];

  // For each tab, find its label and content. NO extra label-row.
  tabLis.forEach((li, i) => {
    const label = li.textContent.trim();
    let panel = tabPanels[i];
    if (!panel && li.getAttribute('aria-controls')) {
      panel = tabsBlock.querySelector(`#${li.getAttribute('aria-controls')}`);
    }
    let contentEl = null;
    if (panel) {
      contentEl = panel.querySelector('article, .contentfragment') || panel;
    }
    cells.push([label, contentEl]);
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  tabsBlock.replaceWith(table);
}
