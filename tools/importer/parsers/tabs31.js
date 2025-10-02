/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.tabs');
  if (!tabsBlock) return;

  // Find the cmp-tabs inside tabsBlock
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels from the tablist
  const tabLabels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tab'));
  // Get tab panels (content)
  const tabPanels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tabpanel'));

  // Defensive: Ensure labels and panels match
  if (tabLabels.length !== tabPanels.length || tabLabels.length === 0) return;

  // Table header row (CRITICAL: must match block name exactly)
  const headerRow = ['Tabs (tabs31)'];
  const rows = [headerRow];

  // For each tab, create a row: [label, content]
  tabLabels.forEach((labelEl, idx) => {
    // Tab label text
    const tabLabel = labelEl.textContent.trim();
    // Tab content: use the entire tabpanel (reference, not clone)
    const tabPanel = tabPanels[idx];
    if (!tabPanel) return;
    rows.push([tabLabel, tabPanel]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabs block with the new table
  tabsBlock.replaceWith(block);
}
