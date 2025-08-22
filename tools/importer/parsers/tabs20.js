/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get all tab labels
  const tabList = tabsRoot.querySelector('.cmp-tabs__tablist');
  const tabLabelEls = tabList ? Array.from(tabList.querySelectorAll('.cmp-tabs__tab')) : [];
  const tabLabels = tabLabelEls.map(el => el.textContent.trim());

  // Get all tab panels
  const tabPanels = Array.from(tabsRoot.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Compose cells: header, tab label row, one row per tab (label, content)
  const cells = [];
  // Header row: exactly one column
  cells.push(['Tabs (tabs20)']);
  // Tab labels row: one label per column
  cells.push(tabLabels);

  // Each tab as [tab label, tab content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    let content = '';
    if (tabPanels[i]) {
      // Prefer contentfragment or article, fallback to panel itself
      content = tabPanels[i].querySelector('.contentfragment, article') || tabPanels[i];
    }
    cells.push([label, content]);
  }

  // Create the block table and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
