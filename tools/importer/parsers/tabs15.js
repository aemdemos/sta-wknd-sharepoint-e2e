/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block in the source HTML
  const tabsBlock = element.querySelector('.tabs.panelcontainer');
  if (!tabsBlock) return;

  // Find the tabs component inside the tabs block
  const tabs = tabsBlock.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get tab labels from the tablist
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  const tabLabels = Array.from(tabList.querySelectorAll('.cmp-tabs__tab')).map(tab => tab.textContent.trim());

  // Get tab panels (contents)
  const tabPanels = Array.from(tabs.querySelectorAll('.cmp-tabs__tabpanel'));

  // Defensive: Only keep as many panels as labels
  const tabRows = [];
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    if (!panel) continue;
    // Use the entire contentfragment as the tab content (resilient to variations)
    const contentFragment = panel.querySelector('.cmp-contentfragment');
    let tabContent;
    if (contentFragment) {
      tabContent = contentFragment;
    } else {
      // Fallback: use panel itself
      tabContent = panel;
    }
    tabRows.push([label, tabContent]);
  }

  // Table header row
  const headerRow = ['Tabs (tabs15)'];

  // Build table data
  const tableData = [headerRow, ...tabRows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableData, document);

  // Replace the original tabs block with the new table
  tabsBlock.replaceWith(block);
}
