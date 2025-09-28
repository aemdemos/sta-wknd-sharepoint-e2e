/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.tabs.panelcontainer');
  if (!tabsBlock) return;

  // Find the tabs component
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels from the tablist
  const tabLabels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tab'));

  // Get tab panels (content)
  const tabPanels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tabpanel'));

  // Defensive: ensure labels and panels match
  if (tabLabels.length !== tabPanels.length) return;

  // Table header row
  const headerRow = ['Tabs (tabs23)'];
  const rows = [headerRow];

  // For each tab, add a row: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const labelText = tabLabels[i].textContent.trim();
    // Tab content: use the whole tabpanel div for resilience
    const panelContent = tabPanels[i];
    rows.push([labelText, panelContent]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block with the new table
  tabsBlock.replaceWith(block);
}
