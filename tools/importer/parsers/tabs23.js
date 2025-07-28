/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block in the given element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Header row with block name exactly as required
  const headerRow = ['Tabs (tabs23)'];

  // Parse tab labels (ordered)
  const tabList = tabs.querySelector('ol.cmp-tabs__tablist, ul.cmp-tabs__tablist');
  let tabLabels = [];
  if (tabList) {
    tabLabels = Array.from(tabList.children).map(el => el.textContent.trim());
  }

  // Parse tab panels (ordered to match labels)
  const tabPanels = tabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]');
  const tabRows = [];
  tabPanels.forEach((panel, i) => {
    // Defensive: fallback in case of missing label
    const label = tabLabels[i] || `Tab ${i+1}`;
    // Find main content: prefer the first contentfragment/article, else whole panel
    let contentBlock = null;
    let article = panel.querySelector('article.cmp-contentfragment');
    if (article) {
      contentBlock = article;
    } else {
      contentBlock = panel;
    }
    // Each row: [tab label, tab content]
    tabRows.push([label, contentBlock]);
  });

  // Only create the table if there is content
  if (tabRows.length > 0) {
    const cells = [headerRow, ...tabRows];
    const block = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(block);
  }
}
