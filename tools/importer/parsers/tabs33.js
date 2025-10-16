/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs container
  const tabsRoot = element.querySelector('.tabs .cmp-tabs');
  if (!tabsRoot) return;

  // Get tab labels (tab headers)
  const tabLabels = Array.from(
    tabsRoot.querySelectorAll('.cmp-tabs__tablist > li[role="tab"]')
  ).map(li => li.textContent.trim());

  // Get tab panels (tab content)
  const tabPanels = Array.from(
    tabsRoot.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Defensive: Only process if labels and panels match
  if (!tabLabels.length || tabLabels.length !== tabPanels.length) return;

  // Build the rows for the table
  const rows = [];
  // Header row as per spec
  rows.push(['Tabs (tabs33)']);

  // For each tab, add a row: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    // Defensive: skip if no panel
    if (!panel) continue;
    // Use the panel element directly as content
    rows.push([label, panel]);
  }

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block with the new table
  tabsRoot.replaceWith(block);
}
