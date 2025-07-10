/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs block
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get all tab labels, preserving order
  const tablist = tabs.querySelector('.cmp-tabs__tablist');
  const tabLabelEls = tablist ? Array.from(tablist.querySelectorAll('li[role="tab"]')) : [];
  const tabLabels = tabLabelEls.map(li => li.textContent.trim());

  // Get all tab panels in order
  const tabPanels = Array.from(tabs.querySelectorAll('.cmp-tabs__tabpanel'));

  // Build the table header row
  const headerRow = ['Tabs (tabs15)'];
  // Build the table content rows: each with 2 columns (tab label, tab content)
  const tableRows = [];

  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    let contentCell;
    if (panel) {
      // For robustness, use all children in the tabpanel except empty grid fillers
      // We'll filter out "aem-Grid" elements that are just structural
      const nodes = Array.from(panel.childNodes).filter(node => {
        // Remove empty text nodes
        if (node.nodeType === 3 && !node.textContent.trim()) return false;
        // Remove empty grid elements
        if (node.nodeType === 1 && node.classList.contains('aem-Grid')) return false;
        return true;
      });
      // Use all content nodes directly; if only one, just use that
      contentCell = nodes.length === 1 ? nodes[0] : nodes;
    } else {
      contentCell = '';
    }
    tableRows.push([label, contentCell]);
  }

  const table = [headerRow, ...tableRows];

  const block = WebImporter.DOMUtils.createTable(table, document);
  element.replaceWith(block);
}
