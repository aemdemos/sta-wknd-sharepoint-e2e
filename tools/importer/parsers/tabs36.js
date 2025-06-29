/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs root element
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Find tab labels
  const tabList = tabsRoot.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('li'));

  // Find all tabpanels
  const tabPanels = Array.from(tabsRoot.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Build the rows array for the table
  const rows = [];
  // Header row
  rows.push(['Tabs (tabs36)']);

  // For each tab, find the label and corresponding panel
  for (let i = 0; i < tabLabels.length; i++) {
    const labelEl = tabLabels[i];
    // Defensive: skip if no label
    if (!labelEl) continue;
    const labelText = labelEl.textContent.trim();

    // Find corresponding panel by aria-labelledby
    let panel = null;
    const tabId = labelEl.id;
    if (tabId) {
      panel = tabPanels.find(p => p.getAttribute('aria-labelledby') === tabId);
    }
    // Fallback to nth if not found
    if (!panel && tabPanels[i]) panel = tabPanels[i];
    if (!panel) continue;

    // Extract tab content: grab the first 'article' inside the panel, else fallback to the panel itself
    let tabContent = panel.querySelector('article');
    if (!tabContent) tabContent = panel;

    // Add row: [label, content]
    rows.push([labelText, tabContent]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the tabs block root with the table
  tabsRoot.replaceWith(table);
}
