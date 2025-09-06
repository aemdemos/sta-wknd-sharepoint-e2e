/* global WebImporter */
export default function parse(element, { document }) {
  // Only process the tabs block
  if (!element || !element.classList.contains('tabs')) return;

  // Find the main tabs container
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get tab labels (in order)
  const tabLabels = Array.from(
    tabsRoot.querySelectorAll('.cmp-tabs__tablist > li[role="tab"]')
  ).map(tab => tab.textContent.trim());

  // Get tab panels (in order)
  const tabPanels = Array.from(
    tabsRoot.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Defensive: Ensure labels and panels match
  if (tabLabels.length !== tabPanels.length) return;

  // Build rows: header, then one row per tab
  const rows = [];
  // Always use the required block name header
  const headerRow = ['Tabs (tabs24)'];
  rows.push(headerRow);

  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];

    // For the content cell, clone the panel so we don't move it from the DOM
    const panelClone = panel.cloneNode(true);
    // Remove the tabpanel container itself, just use its children
    const contentNodes = Array.from(panelClone.childNodes).filter(node => {
      // Filter out empty text nodes
      return !(node.nodeType === Node.TEXT_NODE && !node.textContent.trim());
    });
    let cellContent;
    if (contentNodes.length === 1) {
      cellContent = contentNodes[0];
    } else if (contentNodes.length > 1) {
      cellContent = contentNodes;
    } else {
      cellContent = '';
    }
    rows.push([label, cellContent]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Actually replace the tabsRoot (not just the .tabs wrapper) to ensure DOM is modified
  tabsRoot.replaceWith(table);
}
