/* global WebImporter */
export default function parse(element, { document }) {
  // Only parse if this is a tabs block
  if (!element || !element.classList.contains('tabs')) return;

  // Header row for Tabs (tabs3)
  const headerRow = ['Tabs (tabs3)'];

  // Find the tabs container
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get tab labels
  const tabLabels = Array.from(
    tabsRoot.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab')
  );

  // Get tab panels
  const tabPanels = Array.from(
    tabsRoot.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Defensive: Match tabPanels to tabLabels by order
  const rows = tabLabels.map((tabLabel, i) => {
    // Tab label text
    const label = tabLabel.textContent.trim();
    // Corresponding panel
    const panel = tabPanels[i];
    let content = '';
    if (panel) {
      // Use the panel's textContent (includes all visible text)
      content = panel.textContent.trim();
    }
    return [label, content];
  });

  // Compose the table data
  const tableData = [headerRow, ...rows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableData, document);

  // Replace the original element
  if (block) {
    element.replaceWith(block);
  }
}
