/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.tabs.panelcontainer');
  if (!tabsBlock) return;

  // Find the cmp-tabs element
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels (order matters)
  const tabLabels = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab')
  ).map(tab => tab.textContent.trim());

  // Get tab panels (order matters)
  const tabPanels = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Defensive: Only process if number of labels matches number of panels
  if (tabLabels.length !== tabPanels.length) return;

  // Build header row as required
  const headerRow = ['Tabs (tabs24)'];

  // Build tab rows: [label, content]
  const tabRows = tabLabels.map((label, idx) => {
    // Tab label cell
    const labelCell = label;
    // Tab content cell: reference the contentfragment/article inside the tabpanel
    const panel = tabPanels[idx];
    // Find the main contentfragment/article inside the panel
    let contentFragment = panel.querySelector('article.cmp-contentfragment');
    if (!contentFragment) {
      // fallback: use panel itself
      contentFragment = panel;
    }
    return [labelCell, contentFragment];
  });

  // Compose table data
  const tableData = [headerRow, ...tabRows];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(tableData, document);

  // Replace tabs block with block table
  tabsBlock.replaceWith(block);
}
