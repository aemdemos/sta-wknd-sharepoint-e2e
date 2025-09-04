/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs container
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get tab labels from the tablist
  const tabLabels = Array.from(
    tabs.querySelectorAll('.cmp-tabs__tablist > li[role="tab"]')
  ).map(li => li.textContent.trim());

  // Get tab panels (content)
  const tabPanels = Array.from(
    tabs.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Defensive: ensure matching number of labels and panels
  if (tabLabels.length !== tabPanels.length) {
    // fallback: skip if mismatch
    return;
  }

  // Build the table rows
  const rows = [];
  // Header row as per requirements
  rows.push(['Tabs (tabs32)']);

  // For each tab, add a row: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];

    // Defensive: clone the content to avoid moving it in DOM
    // But per instructions, reference the element directly
    // We'll reference the panel's content div (not the panel itself)
    // Usually, the content is a .contentfragment inside the panel
    let content = null;
    // Try to find the main content block inside the tabpanel
    const contentFragment = panel.querySelector('.contentfragment');
    if (contentFragment) {
      content = contentFragment;
    } else {
      // fallback: use the panel itself
      content = panel;
    }
    rows.push([label, content]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
