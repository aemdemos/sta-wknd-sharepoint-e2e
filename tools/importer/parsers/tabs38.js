/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get tab labels (li elements inside ol[role=tablist])
  const tabList = tabsRoot.querySelector('ol[role="tablist"]');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('li'));

  // Get tab panels (div[role=tabpanel])
  const tabPanels = Array.from(tabsRoot.querySelectorAll('div[role="tabpanel"]'));

  // Defensive: ensure same number of tabs and panels
  if (tabLabels.length !== tabPanels.length) return;

  // Build table rows
  const rows = [];
  // Header row (block name)
  rows.push(['Tabs (tabs38)']);

  // For each tab, add a row: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];

    // Defensive: panel may have a single contentfragment/article, or more
    // We'll grab all direct children of the tabpanel
    // If only one child, just use it; if multiple, put all in an array
    let contentNodes = Array.from(panel.childNodes).filter(n => {
      // Filter out empty text nodes
      return !(n.nodeType === Node.TEXT_NODE && !n.textContent.trim());
    });
    let content;
    if (contentNodes.length === 1) {
      content = contentNodes[0];
    } else {
      content = contentNodes;
    }
    rows.push([label, content]);
  }

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block with the new table
  tabsRoot.replaceWith(table);
}
