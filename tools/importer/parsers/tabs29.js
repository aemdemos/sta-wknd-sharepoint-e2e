/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.tabs .cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels from the tablist
  const tabLabels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tablist > li')).map(li => li.textContent.trim());

  // Get all tabpanel elements (tab content, order matters)
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Prepare header
  const headerRow = ['Tabs (tabs29)'];
  // Prepare tab label/content rows
  const rows = [];
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    if (!panel) continue;
    // Reference the panel element directly; its child structure preserves semantics and all text/images/lists
    rows.push([label, panel]);
  }

  // Only proceed if at least one tab is present
  if (rows.length === 0) return;
  const cells = [headerRow, ...rows];
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(blockTable);
}
