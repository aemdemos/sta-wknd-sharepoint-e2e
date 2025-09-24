/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block within the element
  const tabsBlock = element.querySelector('.tabs.panelcontainer');
  if (!tabsBlock) return;

  // Find the cmp-tabs container
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get the tab labels
  const tabLabels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tablist > li'));

  // Get all tab panels
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Defensive: Only proceed if we have matching labels and panels
  if (tabLabels.length !== tabPanels.length || tabLabels.length === 0) return;

  // Table header row
  const headerRow = ['Tabs (tabs39)'];
  const rows = [headerRow];

  // Build each tab row: [Tab Label, Tab Content]
  for (let i = 0; i < tabLabels.length; i++) {
    // Tab label
    const labelText = tabLabels[i].textContent.trim();
    // Tab content (use the entire tab panel)
    const panel = tabPanels[i];
    // Defensive: If the panel contains a single wrapper div, use its children
    let content;
    // If the panel has only one child and it's a div.contentfragment, use that
    const contentFragment = panel.querySelector('.contentfragment');
    if (contentFragment) {
      content = contentFragment;
    } else {
      // Otherwise, use the panel itself
      content = panel;
    }
    rows.push([labelText, content]);
  }

  // Create the block table
  const blockTable = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block with the new table
  tabsBlock.replaceWith(blockTable);
}
