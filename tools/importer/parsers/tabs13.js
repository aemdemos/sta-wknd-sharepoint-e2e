/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cmp-tabs element inside the given element (the main tabs block)
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get the tab labels in order
  const tabLabelElements = tabs.querySelectorAll('.cmp-tabs__tablist [role="tab"]');
  const tabLabels = Array.from(tabLabelElements).map(
    tab => tab.textContent.trim()
  );

  // Get the tabpanels in order (should match tab order)
  const tabPanels = Array.from(
    tabs.querySelectorAll('[role="tabpanel"][data-cmp-hook-tabs="tabpanel"]')
  );

  // Build the block table
  const header = ['Tabs (tabs13)'];

  // Each row is [tab label, tab content], referencing existing DOM where possible
  const rows = tabPanels.map((tabpanel, idx) => {
    // Defensive: if tabpanel is missing or empty
    let contentCell;
    if (tabpanel) {
      // Collect all child nodes except empty grid wrappers
      const contentNodes = [];
      Array.from(tabpanel.childNodes).forEach(node => {
        if (
          node.nodeType === 1 &&
          node.matches('div') &&
          node.classList.contains('aem-Grid') &&
          node.textContent.trim() === ''
        ) {
          return;
        }
        // Don't add completely empty text nodes
        if (node.nodeType === 3 && node.textContent.trim() === '') {
          return;
        }
        contentNodes.push(node);
      });
      if (contentNodes.length === 1) {
        contentCell = contentNodes[0];
      } else if (contentNodes.length > 1) {
        contentCell = contentNodes;
      } else {
        // No nodes: provide empty string
        contentCell = '';
      }
    } else {
      contentCell = '';
    }
    // Tab label (from tabLabels, fallback to empty string)
    const tabLabel = tabLabels[idx] || '';
    return [tabLabel, contentCell];
  });

  const cells = [header, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  tabs.replaceWith(table);
}
