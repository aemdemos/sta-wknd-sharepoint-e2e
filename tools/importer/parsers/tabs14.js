/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cmp-tabs element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels from the tablist (should match tabpanels order)
  const tabListItems = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab'));
  const tabPanels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tabpanel'));

  // Defensive: Only use tabs that have a corresponding tabpanel
  // (Some implementations may have tab, but no panel)
  const numTabs = Math.min(tabListItems.length, tabPanels.length);

  const headerRow = ['Tabs (tabs14)'];
  const rows = [];

  for (let i = 0; i < numTabs; i++) {
    // Tab label as string
    const label = tabListItems[i].textContent.trim();
    // Tab content is the corresponding panel element (reference, not clone)
    const content = tabPanels[i];
    rows.push([label, content]);
  }

  // Compose table cells
  const cells = [headerRow, ...rows];
  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace only the tabsBlock with the block table
  tabsBlock.parentNode.replaceChild(block, tabsBlock);
}
