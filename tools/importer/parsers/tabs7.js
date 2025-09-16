/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block (by class)
  const tabsBlock = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  if (!tabsBlock) return;

  // Find the cmp-tabs element if not already selected
  const cmpTabs = tabsBlock.classList.contains('cmp-tabs') ? tabsBlock : tabsBlock.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels from the tablist
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('[role="tab"]'));

  // Get tab panels (content)
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[role="tabpanel"]'));

  // Defensive: ensure same number of tabs and panels
  if (tabLabels.length !== tabPanels.length) return;

  // Build table rows
  const rows = [];
  // Header row
  rows.push(['Tabs (tabs7)']);

  // For each tab, add a row with [tab label, tab content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];

    // Defensive: skip if panel is missing
    if (!panel) continue;

    // For content, use the direct children of the tabpanel (excluding the tabpanel wrapper itself)
    // We'll collect all children nodes (elements and text) inside the tabpanel
    const contentNodes = Array.from(panel.childNodes).filter(n => {
      // Remove empty text nodes
      return n.nodeType !== Node.TEXT_NODE || n.textContent.trim() !== '';
    });
    // If only one element, just use that, else use array
    let contentCell;
    if (contentNodes.length === 1) {
      contentCell = contentNodes[0];
    } else {
      contentCell = contentNodes;
    }
    rows.push([label, contentCell]);
  }

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabs block with the new table
  tabsBlock.replaceWith(table);
}
