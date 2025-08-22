/* global WebImporter */
export default function parse(element, { document }) {
  // Find the "tabs" block root (the one with class .tabs)
  const tabsContainer = element.querySelector('.tabs');
  if (!tabsContainer) return;
  const cmpTabs = tabsContainer.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Table header row, must match block name
  const headerRow = ['Tabs (tabs31)'];

  // Get tab labels
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.children).map(li => li.textContent.trim());

  // Get tab panels in order
  const tabPanels = cmpTabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]');

  // Defensive check: ensure we have same number of labels as panels
  const minLen = Math.min(tabLabels.length, tabPanels.length);
  const rows = [];
  for (let i = 0; i < minLen; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    // Try to get .cmp-contentfragment or otherwise all child nodes
    let content = null;
    const fragment = panel.querySelector('.cmp-contentfragment');
    if (fragment) {
      content = fragment;
    } else {
      // If no fragment, use all childNodes as an array
      content = Array.from(panel.childNodes);
    }
    rows.push([label, content]);
  }

  // Compose the final table structure
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the tabs block (.cmp-tabs) with the table
  cmpTabs.parentNode.replaceChild(table, cmpTabs);
}
