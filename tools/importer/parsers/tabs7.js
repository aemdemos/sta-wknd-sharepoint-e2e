/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs block
  const tabsBlock = element.querySelector('.tabs .cmp-tabs');
  if (!tabsBlock) return;

  // Find the tab labels
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  const tabLabelEls = tabList ? Array.from(tabList.querySelectorAll('li[role="tab"]')) : [];

  // Find panels (content for each tab)
  const tabPanels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tabpanel'));

  // If there are no tab labels or panels, do nothing
  if (!tabLabelEls.length || !tabPanels.length) return;

  // Header row: the block name as a single column
  const headerRow = ['Tabs (tabs7)'];

  // Each tab gets its own row: [Tab Label, Tab Content]
  const tabRows = tabLabelEls.map((labelEl, i) => {
    // Defensive: If a tab panel is missing for a label, use empty div
    const contentEl = tabPanels[i] || document.createElement('div');
    return [labelEl, contentEl];
  });

  // Compose the table
  const cells = [headerRow, ...tabRows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original tabs block with the new table
  tabsBlock.parentNode.replaceChild(block, tabsBlock);
}
