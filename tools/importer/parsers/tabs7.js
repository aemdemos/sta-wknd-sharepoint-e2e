/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs block within the current element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get all tab labels in order
  const tabLabels = Array.from(
    tabs.querySelectorAll('.cmp-tabs__tablist [role="tab"]')
  ).map(tab => tab.textContent.trim());

  // Get all tab panels in order
  const tabPanels = Array.from(
    tabs.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Header row as in the example
  const headerRow = ['Tabs (tabs7)'];
  const table = [headerRow];

  // For each tab, add a row with [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    if (!panel) continue; // Defensive, but should always match

    // Defensive: Find the most relevant content container inside the tab panel
    // We want to preserve all meaningful content and markup
    // Use the .cmp-contentfragment if present, else the direct panel children
    let contentElement = null;
    // Prefer the .cmp-contentfragment, but fallback if not present
    contentElement = panel.querySelector('.cmp-contentfragment') || panel;

    // Reference the content element directly, preserving all children and markup
    table.push([label, contentElement]);
  }

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(table, document);

  // Replace the tabs element with the new block table
  tabs.replaceWith(block);
}
