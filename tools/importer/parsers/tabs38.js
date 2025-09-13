/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the .cmp-tabs block inside the given element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Header row as per requirements
  const headerRow = ['Tabs (tabs38)'];
  const rows = [headerRow];

  // Get tab labels (order matters)
  const tabLabels = Array.from(
    tabs.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab')
  );

  // Get tab panels (order must match tabLabels)
  const tabPanels = Array.from(
    tabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]')
  );

  // Defensive: ensure we have the same number of tabs and panels
  const count = Math.min(tabLabels.length, tabPanels.length);

  for (let i = 0; i < count; i++) {
    const label = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];

    // Defensive: find the main content inside the tab panel
    // Usually a .contentfragment or similar
    let content = null;
    // Try to find .contentfragment, fallback to panel itself
    content = panel.querySelector('.contentfragment') || panel;

    // Place the label and the content element in the row
    rows.push([
      label,
      content
    ]);
  }

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs element with the table
  tabs.replaceWith(table);
}
