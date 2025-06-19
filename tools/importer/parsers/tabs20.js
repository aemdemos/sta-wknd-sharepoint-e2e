/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the tabs block root element (with .cmp-tabs)
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Collect tab labels from the tablist (li elements)
  const tabList = tabsRoot.querySelector('.cmp-tabs__tablist');
  const tabLabels = tabList ? Array.from(tabList.querySelectorAll('.cmp-tabs__tab')) : [];

  // Map tabpanel id to the panel element for reliable lookup
  const tabPanels = Array.from(tabsRoot.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));
  const tabPanelById = {};
  tabPanels.forEach(panel => {
    if (panel.id) {
      tabPanelById[panel.id] = panel;
    }
  });

  // Build the table: first row is the Tabs header
  const headerRow = ['Tabs (tabs20)'];
  const table = [headerRow];

  // For each tab: get label from <li> and content from corresponding tabpanel
  tabLabels.forEach(tabLabel => {
    const label = tabLabel.textContent.trim();
    // Find tabPanel by aria-controls
    let panel = null;
    const panelId = tabLabel.getAttribute('aria-controls');
    if (panelId && tabPanelById[panelId]) {
      panel = tabPanelById[panelId];
    } else {
      // fallback: try to match by order
      const idx = tabLabels.indexOf(tabLabel);
      if (tabPanels[idx]) panel = tabPanels[idx];
    }
    if (!panel) return; // skip if cannot find panel
    // Insert the tab as [Tab Label, Tab Content Element]
    table.push([label, panel]);
  });

  // Create the block table using the helper
  const block = WebImporter.DOMUtils.createTable(table, document);
  // Replace the original tabsRoot with the new block
  tabsRoot.replaceWith(block);
}
