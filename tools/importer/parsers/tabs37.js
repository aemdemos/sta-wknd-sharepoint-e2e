/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get immediate children by selector
  function getImmediateChildren(parent, selector) {
    return Array.from(parent.children).filter((el) => el.matches(selector));
  }

  // Find the tabs block (by class)
  const tabsBlock = element.querySelector('.tabs.panelcontainer');
  if (!tabsBlock) return;

  // Find the cmp-tabs element inside the tabs block
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels (li elements inside ol[role=tablist])
  const tabLabels = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tablist > li[role="tab"]')
  ).map(li => li.textContent.trim());

  // Get tab panels (div[role=tabpanel])
  const tabPanels = Array.from(
    cmpTabs.querySelectorAll('div[role="tabpanel"]')
  );

  // Defensive: Only keep as many panels as labels
  const tabCount = Math.min(tabLabels.length, tabPanels.length);

  // Table header row
  const headerRow = ['Tabs (tabs37)'];

  // Build table rows for each tab
  const rows = [];
  for (let i = 0; i < tabCount; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];

    // Defensive: If the panel is empty, skip
    if (!panel) continue;

    // Find the contentfragment inside the panel
    const contentFragment = panel.querySelector('.contentfragment, .cmp-contentfragment');
    let tabContent;
    if (contentFragment) {
      // Use the entire content fragment as the tab content
      tabContent = contentFragment;
    } else {
      // Fallback: use the panel itself
      tabContent = panel;
    }

    rows.push([label, tabContent]);
  }

  // Compose the table data
  const tableData = [headerRow, ...rows];

  // Create the block table
  const blockTable = WebImporter.DOMUtils.createTable(tableData, document);

  // Replace the tabs block with the new table
  tabsBlock.replaceWith(blockTable);
}
