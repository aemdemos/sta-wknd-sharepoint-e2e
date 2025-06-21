/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs element
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Find tab labels from the tablist in order
  const tabList = tabsRoot.querySelector('.cmp-tabs__tablist');
  const tabLabels = Array.from(tabList ? tabList.querySelectorAll('.cmp-tabs__tab') : []);

  // Find all panels (order matches tab labels)
  const tabPanels = Array.from(tabsRoot.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Build the rows for createTable
  const rows = [];
  // Header row, as per block name
  rows.push(['Tabs (tabs3)']);

  // Each row: [tab label, tab content]
  for (let i = 0; i < tabLabels.length; i++) {
    // tab label - from tab element text
    const label = tabLabels[i]?.textContent?.trim() || '';

    // tab content - use the first meaningful direct contentfragment/article, else use the entire tab panel
    let panelContent = '';
    if (tabPanels[i]) {
      // If panel contains one .contentfragment > article, use that
      const cf = tabPanels[i].querySelector('.contentfragment');
      if (cf) {
        const article = cf.querySelector('article');
        if (article) {
          panelContent = article;
        } else {
          panelContent = cf;
        }
      } else {
        // fallback: use the whole panel
        panelContent = tabPanels[i];
      }
    }
    rows.push([label, panelContent]);
  }

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
