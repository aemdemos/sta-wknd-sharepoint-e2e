/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block in the source HTML
  const tabsBlock = element.querySelector('.tabs.panelcontainer');
  if (!tabsBlock) return;

  // Get the cmp-tabs element
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels from the tablist (li elements)
  const tabLabels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get tab panels (divs with role="tabpanel")
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[role="tabpanel"]'));

  // Defensive: Only include tabs that have both label and panel
  const tabRows = [];
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    if (!label || !panel) continue;

    // Tab label: Use the text content
    const tabLabel = label.textContent.trim();

    // Tab content: Use the entire tabpanel content
    // If the panel contains a single contentfragment, use that
    let tabContent;
    const cf = panel.querySelector('.contentfragment');
    if (cf) {
      tabContent = cf;
    } else {
      // Otherwise, use the panel itself
      tabContent = panel;
    }

    tabRows.push([tabLabel, tabContent]);
  }

  // Build the table rows
  const headerRow = ['Tabs (tabs38)'];
  const cells = [headerRow, ...tabRows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original tabs block with the new table
  tabsBlock.replaceWith(block);
}
