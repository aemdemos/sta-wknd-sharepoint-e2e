/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Header row for the Tabs block
  const headerRow = ['Tabs (tabs8)'];

  // Get tab labels
  const tabLabels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tab'));
  // Get tab panels (in order)
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Defensive: Only process if labels and panels match
  if (tabLabels.length !== tabPanels.length) return;

  // Build rows: [Tab Label, Tab Content]
  const rows = tabLabels.map((tabLabel, i) => {
    // Tab label text
    const label = tabLabel.textContent.trim();
    // Tab panel content (reference the main contentfragment/article inside)
    const panel = tabPanels[i];
    // Find the main content fragment/article inside the panel, or fallback to panel
    let content = panel.querySelector('article') || panel;
    return [label, content];
  });

  // Compose the table data
  const cells = [headerRow, ...rows];

  // Create the block table
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original tabs block with the new table
  tabsBlock.replaceWith(blockTable);
}
