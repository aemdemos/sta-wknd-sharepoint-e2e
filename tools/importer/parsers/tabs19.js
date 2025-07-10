/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the cmp-tabs block within the provided element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Extract all tab labels in order
  const tabLabels = Array.from(
    tabsBlock.querySelectorAll('.cmp-tabs__tablist > li[role="tab"]')
  );

  // Extract all corresponding tab panels in order
  // Only pick direct children with the .cmp-tabs__tabpanel class inside the .cmp-tabs
  const tabPanels = Array.from(
    tabsBlock.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Sanity: if no tabs or no panels, do not process
  if (tabLabels.length === 0 || tabPanels.length === 0) return;

  // Build the block table
  const rows = [];
  // First row: header (must match exactly)
  rows.push(['Tabs (tabs19)']);

  // For each tab label/panel pair, add a new row
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i]?.textContent?.trim() || '';
    let contentCell = null;
    const panel = tabPanels[i];
    if (panel) {
      // Try to find the main content fragment/article inside the panel
      // Use the most semantically-rich existing element as the cell
      let mainContent = panel.querySelector('.cmp-contentfragment, .contentfragment, article');
      if (!mainContent) {
        // If no main content fragment, use the panel itself
        mainContent = panel;
      }
      contentCell = mainContent;
    } else {
      contentCell = '';
    }
    rows.push([label, contentCell]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the tabs block with the new table
  tabsBlock.replaceWith(block);
}
