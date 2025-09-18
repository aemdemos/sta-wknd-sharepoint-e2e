/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs block (the tabs container)
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get all tab labels (li elements inside the tablist)
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('li'));

  // Get all tab panels (content for each tab)
  const tabPanels = Array.from(tabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Defensive: ensure same number of tabs and panels
  if (tabLabels.length !== tabPanels.length) return;

  // Build the table rows
  const rows = [];
  // Header row as per instructions
  rows.push(['Tabs (tabs7)']);

  // For each tab, add a row: [tab label, tab content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];
    // Defensive: get the actual content inside the tab panel (skip empty wrappers)
    // We'll use the first direct child if possible, or the panel itself
    let content = null;
    // Try to find a contentfragment/article or just use the panel
    const mainContent = panel.querySelector('article, .contentfragment, .cmp-contentfragment__elements, div');
    if (mainContent) {
      content = mainContent;
    } else {
      content = panel;
    }
    rows.push([label, content]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabs element with the table
  tabs.replaceWith(table);
}
