/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cmp-tabs container inside element
  const tabsContainer = element.querySelector('.cmp-tabs');
  if (!tabsContainer) return;

  // Extract tab labels from the tablist
  const tabList = tabsContainer.querySelector('.cmp-tabs__tablist');
  const tabLabelEls = tabList ? Array.from(tabList.querySelectorAll('li[role="tab"]')) : [];
  const tabLabels = tabLabelEls.map(li => li.textContent.trim());

  // Get all tabpanel elements in order
  const tabPanels = Array.from(tabsContainer.querySelectorAll('div[role="tabpanel"]'));

  // Compose the rows for each tab: [Tab Label, Tab Content]
  const rows = tabLabels.map((label, idx) => {
    // Defensive: fallback to blank string if missing
    const content = tabPanels[idx] || '';
    return [label, content];
  });

  // Header row as per spec
  const headerRow = ['Tabs (tabs14)'];
  const cells = [headerRow, ...rows];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the entire .cmp-tabs block with the table (not the whole element)
  tabsContainer.replaceWith(table);
}
