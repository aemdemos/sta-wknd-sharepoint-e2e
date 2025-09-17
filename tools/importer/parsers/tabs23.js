/* global WebImporter */
export default function parse(element, { document }) {
  // Only run if this is the root tabs block
  if (!element.classList.contains('tabs')) return;

  // Find tab labels
  const tabLabels = Array.from(element.querySelectorAll('ol[role="tablist"] > li[role="tab"]'));
  // Find tab panels (inside .cmp-tabs)
  const cmpTabs = element.querySelector('.cmp-tabs');
  if (!cmpTabs) return;
  const tabPanels = Array.from(cmpTabs.querySelectorAll('div[role="tabpanel"]'));

  if (tabLabels.length === 0 || tabPanels.length === 0) return;

  // Defensive: ensure labels and panels match
  const n = Math.min(tabLabels.length, tabPanels.length);
  const rows = [ ['Tabs (tabs23)'] ];
  for (let i = 0; i < n; i++) {
    const label = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];
    // Clone the panel so we don't move it in the DOM
    const panelClone = panel.cloneNode(true);
    rows.push([label, panelClone]);
  }

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
