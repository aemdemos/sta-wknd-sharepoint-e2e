/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cmp-tabs element inside this block
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get all tab labels in tablist (li elements inside ol.cmp-tabs__tablist)
  const tabLabelsOl = tabs.querySelector('.cmp-tabs__tablist');
  const tabLabelLis = tabLabelsOl ? Array.from(tabLabelsOl.querySelectorAll('li')) : [];

  // Get all tabpanel divs in the order they appear
  const tabPanels = Array.from(tabs.querySelectorAll('[role="tabpanel"]'));

  // Table header: must match exact block name/variant
  const headerRow = ['Tabs (tabs31)'];
  const tableRows = [headerRow];

  // For each tab, add a row: [Tab Label, Tab Content]
  for (let i = 0; i < tabLabelLis.length; i++) {
    const label = tabLabelLis[i].textContent.trim();
    const panel = tabPanels[i];
    let contentCell;
    if (panel) {
      // We'll put all children of the panel in the content cell, filtering empty nodes.
      const contentNodes = Array.from(panel.childNodes).filter(node => {
        if (node.nodeType === Node.TEXT_NODE) {
          return node.textContent.trim() !== '';
        }
        return true;
      });
      // If only one node, use it; if more, use an array
      contentCell = contentNodes.length === 1 ? contentNodes[0] : contentNodes;
    } else {
      contentCell = '';
    }
    tableRows.push([label, contentCell]);
  }

  // Create and replace block table
  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  tabs.replaceWith(block);
}
