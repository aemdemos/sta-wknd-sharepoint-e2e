/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block in the provided element
  const tabsEl = element.querySelector('.cmp-tabs');
  if (!tabsEl) return;

  // Get all tab labels from tablist (in order)
  const tabLabels = Array.from(tabsEl.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get all tab panels (in order)
  const tabPanels = Array.from(tabsEl.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Prepare the table rows
  const cells = [];
  // Table header as in the example
  cells.push(['Tabs (tabs30)']);

  // For each tab, add a row: [Tab Label, Tab Content]
  tabLabels.forEach((tabLabel, idx) => {
    const label = tabLabel.textContent.trim();
    const panel = tabPanels[idx];
    if (!panel) return;
    // Reference the entire panel's contentfragment (for resilience)
    const contentFragment = panel.querySelector('article.cmp-contentfragment');
    // Fallback to panel if not found
    const content = contentFragment || panel;
    cells.push([label, content]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the whole tabs block with the new table
  tabsEl.parentNode.replaceChild(block, tabsEl);
}
