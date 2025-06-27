/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get all tab labels in order
  const tabLabelEls = tabs.querySelectorAll('.cmp-tabs__tablist > li[role="tab"]');
  // Get all tab panels in order
  const tabPanelEls = tabs.querySelectorAll('.cmp-tabs__tabpanel');

  // Compose the header row
  const headerRow = ['Tabs (tabs28)'];

  // Each row after header: [Tab Label, Tab Content]
  const tabRows = [];
  for (let i = 0; i < tabLabelEls.length; i++) {
    const label = tabLabelEls[i];
    const panel = tabPanelEls[i];
    if (!label || !panel) continue;
    // First cell: tab label text
    const tabLabel = label.textContent.trim();
    // Second cell: reference to all direct children of the panel (from existing DOM)
    const contentNodes = [];
    Array.from(panel.childNodes).forEach(node => {
      if (node.nodeType === 1 || (node.nodeType === 3 && node.textContent.trim())) {
        contentNodes.push(node);
      }
    });
    let contentCell = '';
    if (contentNodes.length === 1) contentCell = contentNodes[0];
    else if (contentNodes.length > 1) contentCell = contentNodes;
    tabRows.push([tabLabel, contentCell]);
  }

  // Compose final table structure: header row + tabRows
  const cells = [headerRow, ...tabRows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  tabs.replaceWith(block);
}
