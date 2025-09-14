/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the tabs block root
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get tab labels from the tablist (ol > li)
  const tabLabels = Array.from(
    tabsRoot.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab')
  ).map(li => li.textContent.trim());

  // Get tab panels (content)
  const tabPanels = Array.from(
    tabsRoot.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Defensive: Only proceed if we have matching labels and panels
  if (!tabLabels.length || tabLabels.length !== tabPanels.length) return;

  // Build rows: header, then [label, content] for each tab
  const rows = [];
  const headerRow = ['Tabs (tabs17)'];
  rows.push(headerRow);

  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];

    // Defensive: Find the main content inside the tab panel
    // Usually a .contentfragment or similar
    let content = null;
    // Try to find the first direct child that is not empty
    for (const child of panel.children) {
      if (child.childElementCount > 0 || child.textContent.trim()) {
        content = child;
        break;
      }
    }
    // Fallback: use the panel itself if nothing else
    if (!content) content = panel;

    // Create the row: [tab label, tab content]
    rows.push([label, content]);
  }

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
