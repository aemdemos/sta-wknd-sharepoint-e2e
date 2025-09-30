/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root
  const tabsRoot = element.querySelector('.tabs .cmp-tabs');
  if (!tabsRoot) return;

  // Get tab labels
  const tabLabels = Array.from(
    tabsRoot.querySelectorAll('.cmp-tabs__tablist > li[role="tab"]')
  ).map(tab => tab.textContent.trim());

  // Get tab panels (content)
  const tabPanels = Array.from(
    tabsRoot.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Defensive: ensure labels and panels match
  if (tabLabels.length !== tabPanels.length) return;

  // Build rows: header first
  const headerRow = ['Tabs (tabs15)'];
  const rows = [headerRow];

  // For each tab, add a row: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    // Defensive: skip if panel is missing
    if (!panel) continue;
    // Use the entire panel div as content cell
    rows.push([label, panel]);
  }

  // Create the table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabsRoot's parent .tabs element with the table
  const tabsContainer = tabsRoot.closest('.tabs');
  if (tabsContainer) {
    tabsContainer.replaceWith(table);
  } else {
    // fallback: replace tabsRoot
    tabsRoot.replaceWith(table);
  }
}
