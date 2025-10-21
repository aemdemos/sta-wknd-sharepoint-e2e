/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block container
  const tabsContainer = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  let tabsRoot = tabsContainer;
  if (!tabsRoot || !tabsRoot.classList.contains('cmp-tabs')) {
    tabsRoot = tabsContainer && tabsContainer.querySelector('.cmp-tabs');
  }
  if (!tabsRoot) return;

  // Get tab labels
  const tabLabels = Array.from(tabsRoot.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get tab panels
  const tabPanels = Array.from(tabsRoot.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Defensive: Only proceed if we have matching labels and panels
  if (!tabLabels.length || !tabPanels.length) return;

  // Table header row
  const headerRow = ['Tabs (tabs31)'];
  const rows = [headerRow];

  // For each tab, add a row: [Tab Label, Tab Content]
  tabLabels.forEach((tabLabel, idx) => {
    // Tab label text
    const labelText = tabLabel.textContent.trim();

    // Defensive: Find the matching panel by aria-controls
    let panel = tabPanels.find(p => {
      return p.getAttribute('aria-labelledby') === tabLabel.id;
    });
    // Fallback: If not found, use index
    if (!panel) {
      panel = tabPanels[idx];
    }
    if (!panel) return;

    // Tab content: Use the entire panel's content
    // Defensive: If the panel only has one child, use that, else use the panel itself
    let tabContent;
    if (panel.children.length === 1) {
      tabContent = panel.children[0];
    } else {
      tabContent = panel;
    }

    rows.push([labelText, tabContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
