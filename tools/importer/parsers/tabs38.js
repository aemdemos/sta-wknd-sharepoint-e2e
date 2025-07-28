/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs element in the provided section
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Find the tab labels (usually in ol.cmp-tabs__tablist > li)
  const tabList = tabsRoot.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabelEls = Array.from(tabList.querySelectorAll('.cmp-tabs__tab'));
  const tabLabels = tabLabelEls.map(tab => tab.textContent.trim());

  // Find the tab panels (in order)
  const panelEls = Array.from(tabsRoot.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Prepare table rows: header, then one row per tab
  const cells = [];
  // Header row: must match the Component/Block info exactly
  cells.push(['Tabs (tabs38)']);

  // Each tab is a row: [tab label, tab content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = panelEls[i];
    if (!panel) continue; // Defensive: skip if no matching panel
    cells.push([label, panel]); // Reference the DOM element for resilience
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the .cmp-tabs element with the new block
  tabsRoot.replaceWith(block);
}