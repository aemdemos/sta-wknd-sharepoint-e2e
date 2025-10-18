/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root
  const tabsRoot = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  let cmpTabs = tabsRoot;
  if (tabsRoot && !tabsRoot.classList.contains('cmp-tabs')) {
    cmpTabs = tabsRoot.querySelector('.cmp-tabs');
  }
  if (!cmpTabs) return;

  // Get tab labels (li elements)
  const tabLabels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get tab panels (div[role=tabpanel])
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[role="tabpanel"]'));

  // Defensive: Only proceed if we have matching labels and panels
  if (!tabLabels.length || !tabPanels.length) return;

  // Build the table rows
  const rows = [];
  // Header row
  rows.push(['Tabs (tabs35)']);

  // For each tab, add a row: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    // Defensive: Find the corresponding tabpanel (by order)
    const panel = tabPanels[i];
    // Defensive: If no panel, skip
    if (!panel) continue;

    // For tab content, use the direct content of the tabpanel
    // Remove aria-hidden panels if you want only visible, but here we want all
    // We'll extract the content inside the tabpanel, but skip the outer div
    // (which may have role, classes, etc.)
    // We'll collect all direct children of the tabpanel
    const contentNodes = Array.from(panel.childNodes).filter(
      (n) => n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim())
    );
    // If only one child, use it directly, else use array
    let content;
    if (contentNodes.length === 1) {
      content = contentNodes[0];
    } else {
      content = contentNodes;
    }
    rows.push([label, content]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original tabs block with the new table
  tabsRoot.replaceWith(table);
}
