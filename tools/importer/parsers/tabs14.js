/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs root (the block root)
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Find tab navigation (tab labels)
  const tabNav = tabsRoot.querySelector('.cmp-tabs__tablist');
  if (!tabNav) return;
  const tabLabels = Array.from(tabNav.querySelectorAll('li[role="tab"]'));

  // Find all tab panels (tab content)
  const tabPanels = Array.from(tabsRoot.querySelectorAll('.cmp-tabs__tabpanel'));
  if (tabLabels.length === 0 || tabPanels.length === 0) return;

  // Build the table rows
  const rows = [];
  // Header row as required
  rows.push(['Tabs (tabs14)']);

  // For each tab, add a row: [label, content]
  tabLabels.forEach((tabLabel, idx) => {
    const label = tabLabel.textContent.trim();
    // Find the corresponding tab panel by aria-controls
    let panel = null;
    const panelId = tabLabel.getAttribute('aria-controls');
    if (panelId) {
      panel = tabsRoot.querySelector(`#${panelId}`);
    } else {
      panel = tabPanels[idx];
    }
    if (!panel) return;

    // Use the main contentfragment/article if present, else the panel itself
    let tabContent = null;
    const cf = panel.querySelector('.cmp-contentfragment, article');
    if (cf) {
      tabContent = cf;
    } else {
      tabContent = panel;
    }

    rows.push([label, tabContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block
  element.replaceWith(block);
}
