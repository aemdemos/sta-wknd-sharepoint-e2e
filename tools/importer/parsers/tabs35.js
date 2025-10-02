/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get direct children by selector
  function getDirectChildren(parent, selector) {
    return Array.from(parent.querySelectorAll(':scope > ' + selector));
  }

  // Find the tabs block
  const tabsBlock = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  if (!tabsBlock) return;

  // Find the cmp-tabs element (may be nested)
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs') || tabsBlock;

  // Get tab labels from tablist
  const tabLabels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tablist > li'));

  // Get tab panels (content)
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Defensive: ensure labels and panels match
  if (tabLabels.length !== tabPanels.length || tabLabels.length === 0) return;

  // Table header row
  const headerRow = ['Tabs (tabs35)'];
  const rows = [headerRow];

  // For each tab, add a row: [Label, Content]
  tabLabels.forEach((labelEl, i) => {
    // Tab label text
    const labelText = labelEl.textContent.trim();

    // Tab content: grab the whole tabpanel div
    const panelEl = tabPanels[i];
    // Defensive: if panel is missing, skip
    if (!panelEl) return;

    // For resilience, use the entire tabpanel element as content
    rows.push([labelText, panelEl]);
  });

  // Create the block table
  const blockTable = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabs block with the new table
  tabsBlock.parentNode.replaceChild(blockTable, tabsBlock);
}
