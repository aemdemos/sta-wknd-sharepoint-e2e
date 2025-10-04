/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs container (by class 'tabs panelcontainer')
  const tabsContainer = element.querySelector('.tabs.panelcontainer');
  if (!tabsContainer) return;

  // Find the cmp-tabs element inside
  const cmpTabs = tabsContainer.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels from the tablist
  const tabLabels = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tablist .cmp-tabs__tab')
  ).map(tab => tab.textContent.trim());

  // Get all tabpanel elements (one per tab)
  const tabPanels = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Defensive: Only proceed if lengths match
  if (tabLabels.length !== tabPanels.length) return;

  // Build the table rows
  const rows = [];
  // Header row per spec
  rows.push(['Tabs (tabs9)']);

  // For each tab, add a row: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];

    // Defensive: clone the content to avoid moving it from DOM
    const panelContent = document.createElement('div');
    // Only append the direct children (not the tabpanel wrapper)
    Array.from(panel.childNodes).forEach(node => {
      // Only include element nodes (skip whitespace text nodes)
      if (node.nodeType === Node.ELEMENT_NODE) {
        panelContent.appendChild(node.cloneNode(true));
      }
    });
    // If no element nodes, fallback to text content
    if (!panelContent.childNodes.length && panel.textContent.trim()) {
      panelContent.textContent = panel.textContent.trim();
    }

    rows.push([label, panelContent]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabsContainer with the new block
  tabsContainer.replaceWith(block);
}
