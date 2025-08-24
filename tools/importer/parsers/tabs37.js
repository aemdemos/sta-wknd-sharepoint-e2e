/* global WebImporter */
export default function parse(element, { document }) {
  // Find tabs block: look for .cmp-tabs inside the given element
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get all tab labels in order
  const tabLabels = Array.from(
    tabsRoot.querySelectorAll('.cmp-tabs__tablist [role="tab"]')
  ).map(tab => tab.textContent.trim());

  // For each tab, find the corresponding panel by order
  const tabPanels = Array.from(
    tabsRoot.querySelectorAll(':scope > [role="tabpanel"]')
  );

  // Build header row: block name exactly as specified
  const table = [['Tabs (tabs37)']];

  // Each tab: label in first cell, corresponding panel content in second
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    if (!panel || !label) continue;
    // Reference the *existing* element, not a clone
    table.push([
      label,
      panel
    ]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(table, document);
  // Replace the original element with the block table
  element.replaceWith(block);
}
