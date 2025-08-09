/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cmp-tabs block within this element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get the tab labels from the tablist (should be <li> elements)
  const tablist = tabsBlock.querySelector('.cmp-tabs__tablist');
  const tabLabels = Array.from(tablist ? tablist.children : []);

  // Get all tab panels (should be in order matching tabLabels)
  const tabPanels = tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]');

  // Compose table rows
  const rows = [];
  // Header row: block name from the specification (must match exactly)
  rows.push(['Tabs (tabs13)']);

  // Each following row: [tab label, tab content element]
  for (let i = 0; i < tabLabels.length && i < tabPanels.length; i++) {
    // Get the label text for this tab
    const label = tabLabels[i]?.textContent?.trim() || '';
    // Use the existing panel element directly (never clone)
    const panel = tabPanels[i];
    rows.push([label, panel]);
  }

  // Create the table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block (not the whole parent)
  tabsBlock.replaceWith(block);
}
