/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs block within the given element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels (typically inside an <ol> with class cmp-tabs__tablist)
  const tabLabels = Array.from(
    tabsBlock.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab')
  ).map(tab => tab.textContent.trim());

  // Get tab panels (typically <div data-cmp-hook-tabs="tabpanel">)
  const tabPanels = Array.from(
    tabsBlock.querySelectorAll('div[data-cmp-hook-tabs="tabpanel"]')
  );

  // Build the table rows
  const rows = [];
  // Header row: block name
  rows.push(['Tabs (tabs20)']);

  // Now, one row per tab: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    // Defensive: might mismatch if there are hidden tabs
    const label = tabLabels[i] || '';
    const panel = tabPanels[i] || '';
    // Use the tab label, and the panel element as-is (reference, not clone)
    rows.push([label, panel]);
  }

  // Create the table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original tabs block with the table
  tabsBlock.replaceWith(table);
}
