/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the tabs block
  const tabsEl = element.querySelector('.cmp-tabs');
  if (!tabsEl) return;

  // Get tab labels from the tab list
  const tabList = tabsEl.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabelElements = Array.from(tabList.querySelectorAll('li'));
  const tabLabels = tabLabelElements.map(tab => tab.textContent.trim());

  // Get all tab panel elements (in order)
  const tabPanels = Array.from(tabsEl.querySelectorAll('.cmp-tabs__tabpanel'));

  // Build the table rows
  // Header: single cell with block name
  const cells = [['Tabs (tabs14)']];

  // Each subsequent row: [tab label, tab content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    // Each tab's content: contentfragment/article if present, else entire panel
    let panelContent = tabPanels[i]?.querySelector('article.cmp-contentfragment');
    if (!panelContent) {
      panelContent = tabPanels[i];
    }
    cells.push([label, panelContent]);
  }

  // Create the table and replace the original
  const table = WebImporter.DOMUtils.createTable(cells, document);
  tabsEl.replaceWith(table);
}
