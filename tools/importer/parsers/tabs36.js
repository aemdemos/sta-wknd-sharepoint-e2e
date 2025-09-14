/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the tabs block
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels
  const tabLabels = Array.from(
    tabsBlock.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab')
  ).map(tab => tab.textContent.trim());

  // Get tab panels (content)
  const tabPanels = Array.from(
    tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]')
  );

  // Build rows: each row is [label, content]
  const rows = tabLabels.map((label, idx) => {
    // Defensive: ensure panel exists
    const panel = tabPanels[idx];
    let content = '';
    if (panel) {
      // Use the entire tabpanel content for resilience
      content = panel;
    }
    return [label, content];
  });

  // Table header
  const headerRow = ['Tabs (tabs36)'];
  const cells = [headerRow, ...rows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original tabs block with the table
  tabsBlock.replaceWith(block);
}
