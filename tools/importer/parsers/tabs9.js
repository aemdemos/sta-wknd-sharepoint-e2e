/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root (the container with .tabs and .cmp-tabs)
  const tabsRoot = element.querySelector('.tabs .cmp-tabs');
  if (!tabsRoot) return;

  // Get the tab header labels in order
  const tabList = tabsRoot.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabelNodes = Array.from(tabList.querySelectorAll('.cmp-tabs__tab'));
  const tabLabels = tabLabelNodes.map(tab => tab.textContent.trim());

  // Get all tabpanels (content sections), in order of appearance
  const tabPanels = Array.from(tabsRoot.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Build header row: block name and variant
  const headerRow = ['Tabs (tabs9)'];

  // Build content rows: Each is [Tab Label, Tab Content Element]
  const rows = tabLabels.map((tabLabel, i) => {
    // Defensive: Get the corresponding tabpanel for this label
    const tabPanel = tabPanels[i];
    let tabContent = '';
    if (tabPanel) {
      // Prefer the main article or contentfragment, but fallback to tabPanel
      const mainFragment = tabPanel.querySelector('article') || tabPanel;
      tabContent = mainFragment;
    }
    return [tabLabel, tabContent];
  });

  // Combine into table array
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the entire tabsRoot (.cmp-tabs) with the new table
  tabsRoot.parentNode.replaceChild(table, tabsRoot);
}
