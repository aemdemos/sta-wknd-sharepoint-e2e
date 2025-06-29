/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs element which holds the tabs block
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get tab labels (li elements in the .cmp-tabs__tablist)
  const tabList = tabsRoot.querySelector('.cmp-tabs__tablist');
  const tabLabels = [];
  if (tabList) {
    tabList.querySelectorAll('li.cmp-tabs__tab').forEach(li => {
      tabLabels.push(li.textContent.trim());
    });
  }

  // Get tab panels (divs with .cmp-tabs__tabpanel)
  const tabPanels = Array.from(tabsRoot.querySelectorAll('div.cmp-tabs__tabpanel[data-cmp-hook-tabs="tabpanel"]'));

  // Build the rows: header, then one row per tab: [tab label, tab content]
  const rows = [];
  // Header row (single column)
  rows.push(['Tabs (tabs3)']);
  // Each tab row: [tab label, tab panel content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    if (!panel) continue;
    // Use the main contentfragment if present, else the panel itself
    let contentElem = panel.querySelector('.contentfragment') || panel.firstElementChild || panel;
    rows.push([label, contentElem]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the tabs block root with the table
  tabsRoot.replaceWith(block);
}
