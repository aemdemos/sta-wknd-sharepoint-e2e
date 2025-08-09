/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block in the given element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get all tab labels
  const tablist = tabs.querySelector('.cmp-tabs__tablist');
  const tabLabels = Array.from(tablist ? tablist.querySelectorAll('li') : []);

  // Get all tab panels
  const tabPanels = Array.from(tabs.querySelectorAll('.cmp-tabs__tabpanel'));

  // Map panel id to panel element
  const panelById = {};
  tabPanels.forEach(panel => {
    const id = panel.getAttribute('id');
    if (id) panelById[id] = panel;
  });

  // Build table rows
  const rows = [];
  // Table header as per requirements
  rows.push(['Tabs (tabs6)']);

  tabLabels.forEach(tabLabel => {
    // 1st cell: tab label text
    const label = tabLabel.textContent.trim();
    // 2nd cell: tab panel content (prefer article.cmp-contentfragment if present, otherwise panel)
    const panelId = tabLabel.getAttribute('aria-controls');
    let contentElem;
    const panelElem = panelById[panelId];
    if (panelElem) {
      // Find the cmp-contentfragment article or just use the panel
      const fragment = panelElem.querySelector('article.cmp-contentfragment');
      contentElem = fragment || panelElem;
    } else {
      contentElem = '';
    }
    rows.push([label, contentElem]);
  });

  // Create table and replace tabs block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  tabs.replaceWith(table);
}
