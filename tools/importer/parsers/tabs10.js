/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs block inside the provided element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Extract all tab labels from the tab list <ol>
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('.cmp-tabs__tab')).map(tab => tab.textContent.trim());

  // Extract all tab panels in order
  const tabPanels = Array.from(tabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Prepare the rows for the table
  const rows = [];
  // Header row as per block definition
  rows.push(['Tabs (tabs10)']);

  // Each tab: label and content
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    if (!label || !panel) continue; // Skip if either is missing
    // For tab content, pull all meaningful children (elements or non-empty text nodes)
    let contentNodes = [];
    if (panel.children.length === 1) {
      // Use sole child directly if present
      contentNodes = [panel.children[0]];
    } else {
      // Use all non-empty element/text nodes
      contentNodes = Array.from(panel.childNodes).filter(
        node => node.nodeType === Node.ELEMENT_NODE || (node.nodeType === Node.TEXT_NODE && node.textContent.trim())
      );
    }
    // Provide a single element/array as expected by createTable
    let contentCell = contentNodes.length === 1 ? contentNodes[0] : contentNodes;
    rows.push([label, contentCell]);
  }

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original tabs element with the new table
  tabs.replaceWith(table);
}
