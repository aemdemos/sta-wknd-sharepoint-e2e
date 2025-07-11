/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsRoot = element.querySelector('.tabs .cmp-tabs');
  if (!tabsRoot) return;

  // Get tab labels
  const tabList = tabsRoot.querySelector('.cmp-tabs__tablist');
  const tabLabels = [];
  if (tabList) {
    tabList.querySelectorAll('li[role="tab"]').forEach((tab) => {
      tabLabels.push(tab.textContent.trim());
    });
  }

  // Get tab panel contents (in source order)
  const tabPanels = Array.from(tabsRoot.querySelectorAll('.cmp-tabs__tabpanel'));
  const numTabs = Math.min(tabLabels.length, tabPanels.length);

  // For each tabPanel, use the main block of content (reference the article/contentfragment inside)
  const contentsRow = tabPanels.slice(0, numTabs).map((panel) => {
    // Look for a direct .contentfragment or .cmp-contentfragment inside
    const mainContent = panel.querySelector('.contentfragment, .cmp-contentfragment');
    if (mainContent) return mainContent;
    // fallback: use all children in a wrapper
    if (panel.children.length === 1) return panel.firstElementChild;
    const wrap = document.createElement('div');
    Array.from(panel.childNodes).forEach((n) => wrap.appendChild(n));
    return wrap;
  });

  // Build the block table: header row (1 cell), then tabs row (one per tab), then content row (one per tab)
  const cells = [
    ['Tabs (tabs34)'], // header row: exactly one cell
    tabLabels.slice(0, numTabs), // tab labels row: one cell per tab
    contentsRow // tab contents row: one cell per tab
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
