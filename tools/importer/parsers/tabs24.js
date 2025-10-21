/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs container
  const tabsContainer = element.querySelector('.tabs .cmp-tabs');
  if (!tabsContainer) return;

  // Get tab headers (labels)
  const tabLabels = Array.from(
    tabsContainer.querySelectorAll('.cmp-tabs__tablist > li[role="tab"]')
  ).map(li => li.textContent.trim());

  // Get tab panels (content)
  const tabPanels = Array.from(
    tabsContainer.querySelectorAll('[role="tabpanel"]')
  );

  // Defensive: tabLabels and tabPanels should match
  if (tabLabels.length !== tabPanels.length) return;

  // Build the table
  const rows = [];
  // Header row
  rows.push(['Tabs (tabs24)']);

  // For each tab, add a row: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    let contentNodes = Array.from(panel.childNodes).filter(node => {
      return node.nodeType !== Node.TEXT_NODE || node.textContent.trim() !== '';
    });
    let contentCell;
    if (contentNodes.length === 1) {
      contentCell = contentNodes[0];
    } else {
      contentCell = contentNodes;
    }
    rows.push([label, contentCell]);
  }

  // Create the table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(table);
}
