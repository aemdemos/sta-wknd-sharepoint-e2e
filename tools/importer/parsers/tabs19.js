/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block within the given element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Find the tab labels from the tab list
  const tabLabels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tablist > li'));
  // Find all panel elements
  const tabPanels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tabpanel'));

  // Build the header row: block name exactly as required
  const rows = [['Tabs (tabs19)']];

  // For each label, find the corresponding panel
  for (let i = 0; i < tabLabels.length; i++) {
    // Get tab label (first cell)
    const label = tabLabels[i]?.textContent?.trim() || '';
    let panel = tabPanels[i];
    // Edge case: If the panels are not in order, match by aria-controls/id
    if (!panel && tabLabels[i]) {
      const controlsId = tabLabels[i].getAttribute('aria-controls');
      panel = controlsId ? tabsBlock.querySelector(`#${controlsId}`) : null;
    }
    // If panel found, put its element in the second cell, otherwise empty string
    let content = '';
    if (panel) {
      // Use the contentfragment/article if available (preserves structure), else the panel
      const article = panel.querySelector('article.cmp-contentfragment');
      content = article || panel;
    }
    rows.push([label, content]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the block in the DOM
  tabsBlock.replaceWith(table);
}
