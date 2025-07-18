/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs block (the one with class cmp-tabs)
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Table header row
  const headerRow = ['Tabs (tabs33)'];

  // Get tab labels from tablist
  const tabList = tabsBlock.querySelector('ol.cmp-tabs__tablist');
  const tabLabels = [];
  if (tabList) {
    tabList.querySelectorAll('li[role="tab"]').forEach(tab => {
      tabLabels.push(tab.textContent.trim());
    });
  }

  // Get all tab panels
  const tabPanels = Array.from(tabsBlock.querySelectorAll('div[role="tabpanel"]'));

  // Compose table rows: [label, content]
  const rows = tabLabels.map((tabLabel, idx) => {
    // Find the matching tab (by index)
    const tab = tabList ? tabList.querySelectorAll('li[role="tab"]')[idx] : null;
    let panel = null;
    if (tab && tab.id) {
      panel = tabsBlock.querySelector('div[role="tabpanel"][aria-labelledby="' + tab.id + '"]');
    }
    // If not found, fallback to index
    if (!panel && tabPanels[idx]) {
      panel = tabPanels[idx];
    }
    // For tab content, prefer the article.cmp-contentfragment, else take everything inside panel
    let tabContent = null;
    if (panel) {
      const contentFragment = panel.querySelector('article.cmp-contentfragment');
      tabContent = contentFragment ? contentFragment : panel;
    }
    return [tabLabel, tabContent];
  });

  // Create the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);

  // Replace the cmp-tabs block with the new table
  tabsBlock.replaceWith(table);
}
