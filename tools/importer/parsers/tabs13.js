/* global WebImporter */
export default function parse(element, { document }) {
  // Only operate if this is a tabs block
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get tab labels
  const tabLabels = Array.from(tabsRoot.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get tab panels (content)
  const tabPanels = Array.from(tabsRoot.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Defensive: match labels and panels
  if (tabLabels.length !== tabPanels.length || tabLabels.length === 0) return;

  // Header row
  const headerRow = ['Tabs (tabs13)'];

  // Build rows: each row is [label, content]
  const rows = tabLabels.map((labelEl, idx) => {
    const label = labelEl.textContent.trim();
    const panel = tabPanels[idx];
    // Clone the panel so we don't move it in the DOM
    const panelClone = panel.cloneNode(true);
    return [label, panelClone];
  });

  // Table cells
  const cells = [headerRow, ...rows];

  // Create table
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the tabsRoot's parent (the .tabs block) with the table
  element.replaceWith(table);
}
