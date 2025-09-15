/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the .cmp-tabs element inside the given element
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get the tab labels (li elements inside ol[role=tablist])
  const tabLabels = Array.from(
    tabsRoot.querySelectorAll('.cmp-tabs__tablist > li[role="tab"]')
  );

  // Get the tab panels (div[role=tabpanel])
  const tabPanels = Array.from(
    tabsRoot.querySelectorAll('div[role="tabpanel"][data-cmp-hook-tabs="tabpanel"]')
  );

  // Defensive: ensure we have the same number of labels and panels
  if (tabLabels.length !== tabPanels.length) return;

  // Build the table rows
  const rows = [];
  // Header row as per spec
  rows.push(['Tabs (tabs38)']);

  // For each tab, add a row: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];
    // Defensive: skip if panel is missing
    if (!panel) continue;

    // For content, we want the inner content of the tabpanel, but not the tabpanel wrapper itself
    // We'll use all direct children of the tabpanel
    const contentNodes = Array.from(panel.childNodes).filter(
      node => !(node.nodeType === Node.TEXT_NODE && !node.textContent.trim())
    );
    // If only one element, use it directly, else use array
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

  // Replace the tabsRoot element with the table
  tabsRoot.replaceWith(table);
}
