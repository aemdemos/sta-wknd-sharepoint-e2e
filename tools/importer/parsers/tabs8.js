/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs root
  const tabsRoot = element.querySelector('.tabs .cmp-tabs');
  if (!tabsRoot) return;

  // Get tab labels
  const tabLabels = Array.from(
    tabsRoot.querySelectorAll('.cmp-tabs__tablist > li')
  ).map(li => li.textContent.trim());

  // Get tab panels (in order)
  const tabPanels = Array.from(
    tabsRoot.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]')
  );

  // Compose the table rows
  // 1. Header row: block name in a single cell
  const cells = [
    ['Tabs (tabs8)'],
    // 2. Tab labels row: one cell per tab label
    tabLabels
  ];

  // 3. Each tab content row: one row per tab, with one cell containing the content, other cells are empty
  for (let i = 0; i < tabLabels.length; i++) {
    const row = Array(tabLabels.length).fill('');
    // Reference the most meaningful content inside the panel
    let panel = tabPanels[i];
    let content = '';
    if (panel) {
      // Try to select the main content (article/cmp-contentfragment), otherwise use panel
      let mainContent = panel.querySelector('article, .cmp-contentfragment, .cmp-contentfragment__elements');
      if (mainContent) {
        content = mainContent;
      } else {
        content = panel;
      }
    }
    row[i] = content;
    cells.push(row);
  }

  // Create and replace with block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
