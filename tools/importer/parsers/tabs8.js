/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get tab labels
  const tabLabels = Array.from(tabsRoot.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get tab panels (in order)
  const tabPanels = Array.from(tabsRoot.querySelectorAll('[role="tabpanel"][data-cmp-hook-tabs="tabpanel"]'));

  // Defensive: ensure same number of labels and panels
  if (tabLabels.length !== tabPanels.length) return;

  // Header row
  const headerRow = ['Tabs (tabs8)'];
  const rows = [headerRow];

  // For each tab, add a row: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];
    // Defensive: skip if no label or panel
    if (!label || !panel) continue;

    // For content: grab all direct children of the tabpanel
    // Usually a single .contentfragment, but could be more
    const contentNodes = Array.from(panel.childNodes).filter(node => {
      // Only include elements or text nodes with non-whitespace
      return (node.nodeType === 1) || (node.nodeType === 3 && node.textContent.trim());
    });
    // If only one element, use it directly, else use array
    let contentCell;
    if (contentNodes.length === 1) {
      contentCell = contentNodes[0];
    } else {
      contentCell = contentNodes;
    }
    rows.push([label, contentCell]);
  }

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the tabs block with the table
  tabsRoot.replaceWith(table);
}
