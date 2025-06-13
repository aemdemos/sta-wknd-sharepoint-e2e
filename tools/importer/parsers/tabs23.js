/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main .cmp-tabs element (the block root for tabs)
  const cmpTabs = element.querySelector('.cmp-tabs');
  if (!cmpTabs) return;
  
  // Get the tab labels in order
  const tabListNode = cmpTabs.querySelector('.cmp-tabs__tablist');
  const tabLabels = [];
  if (tabListNode) {
    tabListNode.querySelectorAll('li[role="tab"]').forEach(tab => {
      tabLabels.push(tab.textContent.trim());
    });
  }

  // Get the tab panels, in document order (should exactly match tabLabels)
  const tabPanels = cmpTabs.querySelectorAll('.cmp-tabs__tabpanel');

  // Build header row per spec
  const headerRow = ['Tabs (tabs23)'];
  const cells = [headerRow];

  // For each tab, add a row: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    if (!panel) continue; // skip if panel missing (defensive)
    // For the content cell: reference the main contentfragment/article, or fallback to all panel children
    let contentElem = null;
    const contentFragment = panel.querySelector('.cmp-contentfragment');
    if (contentFragment) {
      contentElem = contentFragment;
    } else {
      // fallback: put all children as an array (in case of degenerate markup)
      contentElem = Array.from(panel.childNodes);
    }
    cells.push([label, contentElem]);
  }

  // Create the table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the cmp-tabs element (the whole block) with the table
  cmpTabs.parentNode.replaceChild(table, cmpTabs);
}
