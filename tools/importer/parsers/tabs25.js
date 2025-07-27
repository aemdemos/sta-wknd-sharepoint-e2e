/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get all tab labels and corresponding tabpanel contents
  const tabLabels = Array.from(tabs.querySelectorAll('.cmp-tabs__tablist > li'));
  const tabPanels = Array.from(tabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Build header row - must match example
  const headerRow = ['Tabs (tabs25)'];

  // Build rows: each is [tab label, tab content].
  const rows = tabLabels.map((tab) => {
    // Get label as text
    const label = tab.textContent ? tab.textContent.trim() : '';
    // Find the panel by aria-controls reference
    const panelId = tab.getAttribute('aria-controls');
    let panel = panelId ? tabs.querySelector(`#${panelId}`) : null;
    // Fallback: if panel is not found, use tabPanels in order
    if (!panel) {
      // fallback array index: tabPanels in order
      panel = tabPanels[tabLabels.indexOf(tab)] || null;
    }
    // For tab content, prefer .contentfragment child if present (per structure)
    let tabContent = null;
    if (panel) {
      tabContent = panel.querySelector('.contentfragment') || panel;
    }
    return [label, tabContent];
  });

  // Compose the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);

  // Replace the tabs element ONLY (not the entire incoming 'element')
  tabs.replaceWith(table);
}
