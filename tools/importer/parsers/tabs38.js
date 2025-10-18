/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs container
  const tabsContainer = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  let cmpTabs;
  if (tabsContainer && tabsContainer.classList.contains('cmp-tabs')) {
    cmpTabs = tabsContainer;
  } else if (tabsContainer) {
    cmpTabs = tabsContainer.querySelector('.cmp-tabs');
  } else {
    cmpTabs = element.querySelector('.cmp-tabs');
  }
  if (!cmpTabs) return;

  // Get tab labels
  const tabLabels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tablist .cmp-tabs__tab'));
  // Get tab panels
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Defensive: ensure we have matching labels and panels
  if (tabLabels.length === 0 || tabPanels.length === 0) return;

  // Build rows: header first
  const rows = [
    ['Tabs (tabs38)']
  ];

  // For each tab, add a row with [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    // Defensive: get the corresponding panel
    const panel = tabPanels[i];
    if (!panel) continue;
    // Clone the panel content to avoid moving nodes
    const panelContent = document.createElement('div');
    // Only append children, not the panel itself
    Array.from(panel.childNodes).forEach(child => {
      panelContent.appendChild(child.cloneNode(true));
    });
    rows.push([
      label,
      panelContent
    ]);
  }

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original tabs container with the block
  tabsContainer.replaceWith(block);
}
