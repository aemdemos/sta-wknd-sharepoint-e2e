/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs container
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get tab labels in order
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  const tabLabels = tabList ? Array.from(tabList.querySelectorAll('li')).map(tab => tab.textContent.trim()) : [];

  // Get tab contents in order
  const tabPanels = Array.from(tabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));
  const tabContents = tabPanels.map(panel => {
    // Robustly extract the intended content for each tab
    // Prefer the .contentfragment/article inside each tabpanel, else use the tabpanel itself
    const frag = panel.querySelector('.contentfragment, article.cmp-contentfragment');
    if (frag) return frag;
    return panel;
  });

  // Header row matches example precisely
  const headerRow = ['Tabs (tabs10)'];

  // Structure: header row, tab labels row, tab content row (each cell matches tab order)
  const cells = [
    headerRow,
    tabLabels,
    tabContents
  ];

  // Create table using helper
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original tabs with block table
  tabs.parentNode.replaceChild(block, tabs);
}
