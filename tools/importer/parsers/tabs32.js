/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root
  const tabsEl = element.querySelector('.cmp-tabs');
  if (!tabsEl) return;

  // Extract all tab labels in order
  const tabLabelEls = tabsEl.querySelectorAll('.cmp-tabs__tablist .cmp-tabs__tab');
  const tabLabels = Array.from(tabLabelEls).map(tab => tab.textContent.trim());

  // Extract all tab panel elements in order
  const tabPanelEls = tabsEl.querySelectorAll('.cmp-tabs__tabpanel');
  // Defensive: Only pair up as many as we have labels for
  const rowCount = Math.min(tabLabels.length, tabPanelEls.length);

  const rows = [];
  for (let i = 0; i < rowCount; i++) {
    const label = tabLabels[i];
    const panel = tabPanelEls[i];
    // Prefer the <article> if it exists (usually holds the tab content)
    let content = panel.querySelector('article');
    if (!content) {
      // Fallback: use the whole panel content
      content = panel;
    }
    rows.push([label, content]);
  }

  // Table header must match example: Tabs (tabs32)
  const cells = [
    ['Tabs (tabs32)'],
    ...rows,
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}