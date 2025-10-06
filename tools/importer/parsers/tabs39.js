/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.tabs.panelcontainer');
  if (!tabsBlock) return;

  // Find the cmp-tabs element
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels from the tablist
  const tabLabels = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tablist > li[role="tab"]')
  ).map(tab => tab.textContent.trim());

  // Get tab panels (tab content)
  const tabPanels = Array.from(
    cmpTabs.querySelectorAll('[role="tabpanel"]')
  );

  // Defensive: Only keep as many panels as labels
  const tabRows = [];
  for (let i = 0; i < tabLabels.length && i < tabPanels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];

    // Tab content: grab the contentfragment inside the panel
    let tabContent = null;
    const contentFragment = panel.querySelector('.contentfragment');
    if (contentFragment) {
      // Use the contentfragment element directly for robustness
      tabContent = contentFragment;
    } else {
      // Fallback: use the panel itself
      tabContent = panel;
    }
    tabRows.push([label, tabContent]);
  }

  // Table header row
  const headerRow = ['Tabs (tabs39)'];

  // Build table data
  const tableData = [headerRow, ...tabRows];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(tableData, document);

  // Replace the tabs block with the table
  tabsBlock.replaceWith(block);
}
