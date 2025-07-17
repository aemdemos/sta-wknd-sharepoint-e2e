/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs element within the given element
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get all tab labels in order from the tablist (li elements)
  const tabLabels = Array.from(
    tabsRoot.querySelectorAll('.cmp-tabs__tablist li.cmp-tabs__tab')
  ).map(li => li.textContent.trim());

  // Get all tab panels in order, each represents a tab's content
  const tabPanels = Array.from(
    tabsRoot.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]')
  );

  // Defensive: match number of labels and panels
  const minLen = Math.min(tabLabels.length, tabPanels.length);

  // Header row: block name, single column
  const cells = [
    ['Tabs (tabs34)']
  ];

  // For each tab, add a row: [label, content]
  for (let i = 0; i < minLen; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    // Use the main article if available, else whole panel
    let contentElem = panel.querySelector('article') || panel;
    cells.push([label, contentElem]);
  }

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
