/* global WebImporter */
export default function parse(element, { document }) {
  // Only extract the tabs block content, not sidebar or heading
  const tabsContainer = element.querySelector('.tabs .cmp-tabs');
  if (!tabsContainer) return;

  // Get tab labels (tab triggers)
  const tabLabels = Array.from(
    tabsContainer.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab')
  );

  // Get tab panels (tab content)
  const tabPanels = Array.from(
    tabsContainer.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Defensive: Only proceed if we have matching labels and panels
  if (!tabLabels.length || tabLabels.length !== tabPanels.length) return;

  // Build the table rows
  const rows = [];
  // Header row as per requirements
  rows.push(['Tabs (tabs7)']);

  // For each tab, add a row: [label, content]
  tabLabels.forEach((tabLabel, idx) => {
    // Tab label text
    const labelText = tabLabel.textContent.trim();
    // Tab panel content (clone to avoid moving from DOM)
    const panel = tabPanels[idx];
    const contentNodes = Array.from(panel.childNodes).filter(
      (n) => n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim())
    );
    rows.push([
      labelText,
      contentNodes.length === 1 ? contentNodes[0] : contentNodes
    ]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element with the new table
  element.replaceWith(table);
}
