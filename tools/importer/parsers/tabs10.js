/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.tabs.panelcontainer');
  if (!tabsBlock) return;

  // Find the cmp-tabs element
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get all tab labels
  const tabLabels = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tablist .cmp-tabs__tab')
  ).map(tab => tab.textContent.trim());

  // Get all tab panels
  const tabPanels = Array.from(
    cmpTabs.querySelectorAll('[role="tabpanel"]')
  );

  // Defensive: tabLabels.length should match tabPanels.length
  if (tabLabels.length !== tabPanels.length) return;

  // Build header row
  const headerRow = ['Tabs (tabs10)'];

  // Build tab rows
  const tabRows = tabLabels.map((label, idx) => {
    // Tab label cell
    const tabLabelCell = label;
    // Tab content cell: use the whole tab panel's content
    // Defensive: find the contentfragment or main content inside panel
    let tabContentCell = [];
    const panel = tabPanels[idx];
    // Try to find a contentfragment article inside
    const contentFragment = panel.querySelector('article.cmp-contentfragment');
    if (contentFragment) {
      tabContentCell.push(contentFragment);
    } else {
      // Fallback: use all children of the panel
      tabContentCell = Array.from(panel.children);
    }
    return [tabLabelCell, tabContentCell];
  });

  // Compose table cells
  const cells = [headerRow, ...tabRows];

  // Create the block table
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the tabs block with the new table
  tabsBlock.replaceWith(blockTable);
}
