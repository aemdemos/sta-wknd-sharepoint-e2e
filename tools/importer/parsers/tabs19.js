/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get tab labels from the tablist
  const tabLabels = Array.from(
    tabsRoot.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab')
  ).map(li => li.textContent.trim());

  // Get tab panels (content)
  const tabPanels = Array.from(
    tabsRoot.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Defensive: Only keep as many panels as there are labels
  const tabRows = [];
  for (let i = 0; i < tabLabels.length && i < tabPanels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    // Defensive: find the main content inside the tab panel
    // Usually a .contentfragment or similar
    let content = null;
    // Try to find a .contentfragment or .cmp-contentfragment
    content = panel.querySelector('.cmp-contentfragment, .contentfragment');
    // If not found, fallback to the panel itself
    if (!content) content = panel;
    tabRows.push([label, content]);
  }

  // Build the table rows
  const headerRow = ['Tabs (tabs19)'];
  const cells = [headerRow, ...tabRows];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the tabs block with the new table
  tabsRoot.replaceWith(table);
}
