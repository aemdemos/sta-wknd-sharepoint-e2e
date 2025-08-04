/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs container (.cmp-tabs)
  let tabs = element.querySelector('.cmp-tabs');
  if (!tabs && element.classList.contains('cmp-tabs')) tabs = element;
  if (!tabs) return;

  // Extract tab headers
  const tabHeaderNodes = Array.from(
    tabs.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab')
  );
  const tabLabels = tabHeaderNodes.map(tab => tab.textContent.trim());

  // Extract the tab panels (in order)
  const tabPanels = Array.from(
    tabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]')
  );
  const tabCount = Math.min(tabLabels.length, tabPanels.length);
  if (tabCount === 0) return;

  // Compose output table: header row, tab label row, then a row for each tab [label, content]
  const cells = [];

  // Header row (single cell)
  cells.push(['Tabs (tabs30)']);

  // Tab headers row (one cell per tab label)
  cells.push([...tabLabels.slice(0, tabCount)]);

  // One row per tab: [label, content]
  for (let i = 0; i < tabCount; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    // Prefer article.cmp-contentfragment, then .contentfragment, then entire panel
    let mainContent = panel.querySelector('article.cmp-contentfragment') || panel.querySelector('.contentfragment') || panel;
    cells.push([label, mainContent]);
  }

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
