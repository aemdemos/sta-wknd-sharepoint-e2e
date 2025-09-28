/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the tabs block
  const tabsBlock = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  if (!tabsBlock) return;

  // Find the cmp-tabs element
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels
  const tabLabels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tablist > li'));

  // Get tab panels (content)
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Build rows: header first
  const rows = [ ['Tabs (tabs15)'] ];

  // For each tab, add a row: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const labelText = tabLabels[i].textContent.trim();
    // Defensive: Find corresponding tabpanel
    const panel = tabPanels[i];
    if (!panel) continue;
    // For tab content, use the direct tabpanel element (preserves structure)
    rows.push([labelText, panel]);
  }

  // Create the table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block with the new table
  tabsBlock.replaceWith(block);
}
