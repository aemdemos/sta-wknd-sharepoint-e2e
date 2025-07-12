/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs container; look for .cmp-tabs
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get the tab labels (in order)
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  const tabEls = tabList ? Array.from(tabList.querySelectorAll('li[role="tab"]')) : [];
  const tabLabels = tabEls.map(tab => tab.textContent.trim());

  // Get the tab panels (in order, must match tab labels)
  // The association is by order in source DOM, which matches the order of tabs in the tablist
  const panelEls = Array.from(tabs.querySelectorAll('.cmp-tabs__tabpanel'));

  // Build cells rows
  const rows = [];
  // Header row matches exactly the block name in the prompt
  rows.push(['Tabs (tabs26)']);

  // Each tab row: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    // Get the panel element for this tab
    const panel = panelEls[i];
    let content = '';
    if (panel) {
      // Try to find the contentfragment/article for the panel section
      let mainContent = panel.querySelector('article');
      if (!mainContent) {
        // fallback: get the first child that likely holds main content
        // (could be direct contentfragment or other)
        if (panel.childElementCount === 1 && panel.firstElementChild) {
          mainContent = panel.firstElementChild;
        }
      }
      // If still not found, fallback to entire panel
      if (!mainContent) {
        mainContent = panel;
      }
      content = mainContent;
    }
    rows.push([label, content]);
  }

  // Create the table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the tabs element (not the whole element but just the tabs block)
  tabs.replaceWith(table);
}