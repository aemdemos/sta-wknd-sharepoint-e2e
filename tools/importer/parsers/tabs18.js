/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root
  const tabsRoot = element.querySelector('.tabs.panelcontainer');
  if (!tabsRoot) return;

  // Find the cmp-tabs container
  const cmpTabs = tabsRoot.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels from the tablist
  const tabLabels = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tablist .cmp-tabs__tab')
  ).map(tab => tab.textContent.trim());

  // Get tab panels (content)
  const tabPanels = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Defensive: only proceed if we have matching labels and panels
  if (!tabLabels.length || tabLabels.length !== tabPanels.length) return;

  // Build table rows
  const rows = [];
  // Header row
  rows.push(['Tabs (tabs18)']);

  // For each tab, add a row: [Tab Label, Tab Content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];

    // Defensive: clone the panel content to avoid moving nodes
    const panelContent = document.createElement('div');
    // Only include the actual content, not the wrapping tabpanel div
    // Find the first child that is not a script or style
    // Usually, the content is a single .contentfragment
    const mainContent = Array.from(panel.children).find(
      (child) => child.nodeType === 1 && !['SCRIPT', 'STYLE'].includes(child.tagName)
    );
    if (mainContent) {
      panelContent.appendChild(mainContent.cloneNode(true));
    } else {
      // fallback: clone all children
      Array.from(panel.childNodes).forEach(node => {
        panelContent.appendChild(node.cloneNode(true));
      });
    }

    rows.push([label, panelContent]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabsRoot with the new table
  tabsRoot.replaceWith(table);
}
