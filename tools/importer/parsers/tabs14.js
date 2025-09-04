/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs element (the tabs block)
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Header row as required
  const headerRow = ['Tabs (tabs14)'];
  const rows = [headerRow];

  // Get all tab labels (li elements inside the tablist)
  const tabLabels = Array.from(tabs.querySelectorAll('.cmp-tabs__tablist > li'));

  // Get all tab panels (divs with role="tabpanel")
  const tabPanels = Array.from(tabs.querySelectorAll('[role="tabpanel"]'));

  // Defensive: Only process as many panels as there are labels
  const tabCount = Math.min(tabLabels.length, tabPanels.length);

  for (let i = 0; i < tabCount; i++) {
    const label = tabLabels[i]?.textContent?.trim() || '';
    const panel = tabPanels[i];
    // Defensive: If either is missing, skip
    if (!label || !panel) continue;

    // For the content cell, we want the main content inside the tab panel
    // Usually it's a .contentfragment or similar block
    // We'll grab all direct children except for script/style
    const contentNodes = [];
    Array.from(panel.childNodes).forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE || (node.nodeType === Node.TEXT_NODE && node.textContent.trim())) {
        contentNodes.push(node);
      }
    });
    // If only one element, use it directly, else use array
    const contentCell = contentNodes.length === 1 ? contentNodes[0] : contentNodes;
    rows.push([label, contentCell]);
  }

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original tabs element with the block
  tabs.replaceWith(block);
}
