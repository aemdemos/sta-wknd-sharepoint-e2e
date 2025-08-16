/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get all tab labels from the tablist
  const tabLabels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tablist .cmp-tabs__tab')).map(tab => tab.textContent.trim());

  // Get all tab panels in order
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Compose header row with the block name, exactly as specified
  const headerRow = ['Tabs (tabs34)'];

  // Each content row: [Tab Label, Tab Content]
  const rows = tabLabels.map((label, i) => {
    // Reference the entire tabpanel element for content (robust to variations)
    // If panel is missing, fallback to empty string
    const panel = tabPanels[i] || '';
    return [label, panel];
  });

  // Compose the table cells: first header, then one row per tab
  const cells = [headerRow, ...rows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new block table
  element.replaceWith(block);
}
