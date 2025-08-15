/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block in this element
  const tabsWrapper = element.querySelector('.cmp-tabs');
  if (!tabsWrapper) return;

  // Get all tab labels from the tablist
  const tabList = tabsWrapper.querySelector('.cmp-tabs__tablist');
  const tabLabels = [];
  if (tabList) {
    tabList.querySelectorAll('li[role="tab"]').forEach(li => {
      tabLabels.push(li.textContent.trim());
    });
  }

  // Get all tabpanels/content for each tab
  const tabPanels = Array.from(tabsWrapper.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));
  // Ensure the number of labels matches number of panels
  // If not, fallback gracefully by matching pairs
  const panelsCount = tabPanels.length;
  const labelsCount = tabLabels.length;
  const minCount = Math.min(labelsCount, panelsCount);
  const validLabels = tabLabels.slice(0, minCount);
  const validPanels = tabPanels.slice(0, minCount);

  // Header row as per block name
  const headerRow = ['Tabs (tabs20)'];
  // Tab label header row
  const tabHeaderRow = validLabels;
  // Content row: each cell contains the content for each tab
  const tabContentRow = validPanels.map(panel => {
    // Prefer referencing the cmp-contentfragment__elements, else panel itself
    const contentFragment = panel.querySelector('.cmp-contentfragment__elements');
    if (contentFragment) {
      // Some contentfragments have multiple divs - reference the whole .cmp-contentfragment__elements
      return contentFragment;
    } else {
      // Sometimes the tab content is directly inside the panel
      // Use the panel element (excluding tab metadata attributes)
      return panel;
    }
  });

  // Compose the table
  const cells = [
    headerRow,
    tabHeaderRow,
    tabContentRow
  ];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the tabs block with the table block
  tabsWrapper.replaceWith(table);
}
