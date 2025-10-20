/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block container
  const tabsBlock = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  // Defensive: if not found, do nothing
  if (!tabsBlock) return;

  // Find the cmp-tabs container (may be nested)
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs') || tabsBlock;

  // Get tab titles from tablist
  const tabTitles = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab')
  ).map(tab => tab.textContent.trim());

  // Get tab panels (content)
  const tabPanels = Array.from(
    cmpTabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]')
  );

  // Defensive: tabTitles and tabPanels should match
  if (tabTitles.length !== tabPanels.length) {
    // If mismatch, fallback: try to pair by order
    const minLen = Math.min(tabTitles.length, tabPanels.length);
    tabTitles.length = minLen;
    tabPanels.length = minLen;
  }

  // Build table rows
  const rows = [];
  // Header row
  rows.push(['Tabs (tabs3)']);

  // For each tab, add a row: [Tab Title, Tab Content]
  for (let i = 0; i < tabTitles.length; i++) {
    const title = tabTitles[i];
    const panel = tabPanels[i];
    // Defensive: reference the panel directly
    rows.push([
      title,
      panel
    ]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block with the new table
  tabsBlock.replaceWith(block);
}
