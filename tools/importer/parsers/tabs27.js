/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs block within the element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get the tab labels from the tablist
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('li[role="tab"]')).map(tab => tab.textContent.trim());

  // Get tab panels (should match number/order of labels)
  const tabPanels = tabs.querySelectorAll('.cmp-tabs__tabpanel');

  // Build the table structure
  // Header row is per block: ['Tabs (tabs27)'] with one column only
  const rows = [];
  rows.push(['Tabs (tabs27)']); // header row: one cell only

  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    if (!panel) continue; // skip if no panel matches

    // Collect all direct children of tabpanel (elements and significant text)
    let contentNodes = Array.from(panel.childNodes).filter(
      n => (n.nodeType === 1) || (n.nodeType === 3 && n.textContent.trim())
    );

    // If there's only one node, use it; otherwise, wrap in a div
    let content;
    if (contentNodes.length === 1) {
      content = contentNodes[0];
    } else {
      const wrapper = document.createElement('div');
      contentNodes.forEach(n => wrapper.appendChild(n));
      content = wrapper;
    }

    rows.push([label, content]);
  }

  // Create and replace with the table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  
  // Make sure the header (first) row uses only 1 th that spans 2 columns (if >1 columns in body)
  if (rows.length > 1 && table.rows[0].cells.length === 1 && table.rows[1].cells.length === 2) {
    table.rows[0].cells[0].setAttribute('colspan', '2');
  }

  tabs.replaceWith(table);
}
