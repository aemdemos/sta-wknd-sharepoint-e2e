/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cmp-tabs element within the current element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;
  // Get the tab labels (list items)
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  const tabLabels = Array.from(tabList ? tabList.querySelectorAll('.cmp-tabs__tab') : []);
  // Get the tab panels (content for each tab), in DOM order
  const tabPanels = Array.from(tabs.querySelectorAll(':scope > .cmp-tabs__tabpanel'));
  // Compose the rows for the block table
  const headerRow = ['Tabs (tabs12)'];
  const rows = [headerRow];
  // Each subsequent row: [tab label, tab content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i]?.textContent?.trim() || '';
    // Try to get the article inside this tab panel, otherwise use the panel itself
    let contentEl = null;
    if (tabPanels[i]) {
      const article = tabPanels[i].querySelector('article');
      contentEl = article || tabPanels[i];
    } else {
      contentEl = '';
    }
    rows.push([label, contentEl]);
  }
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
