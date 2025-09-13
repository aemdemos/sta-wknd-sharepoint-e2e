/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs container
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get tab labels from the tablist (ol > li)
  const tabLabels = Array.from(
    tabs.querySelectorAll('.cmp-tabs__tablist > li')
  ).map(li => li.textContent.trim());

  // Get tab panels (content for each tab)
  const tabPanels = Array.from(
    tabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]')
  );

  // Defensive: ensure we have matching labels and panels
  const numTabs = Math.min(tabLabels.length, tabPanels.length);

  // Build rows: header, then one row per tab (label, content)
  const rows = [];
  // Header row as required
  rows.push(['Tabs (tabs33)']);

  for (let i = 0; i < numTabs; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    // Defensive: panel may have a single root div, but we want all content inside
    // We'll collect all direct children of the tabpanel
    const contentNodes = Array.from(panel.childNodes).filter(
      node => node.nodeType === 1 || (node.nodeType === 3 && node.textContent.trim())
    );
    // If only one element, use it directly; else, use array
    let contentCell;
    if (contentNodes.length === 1) {
      contentCell = contentNodes[0];
    } else {
      contentCell = contentNodes;
    }
    rows.push([label, contentCell]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs element with the new table
  tabs.replaceWith(table);
}
