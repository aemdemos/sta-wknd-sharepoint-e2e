/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs element (the main tab block)
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get all tab labels (li elements inside ol[role=tablist]) in order
  const tabList = tabs.querySelector('ol[role="tablist"]');
  const tabLabels = [];
  if (tabList) {
    tabList.querySelectorAll('li').forEach(li => {
      tabLabels.push(li.textContent.trim());
    });
  }

  // Get all tab panels in order
  const tabPanels = tabs.querySelectorAll('[role="tabpanel"]');

  // Build the header row for the block table
  const headerRow = ['Tabs (tabs31)'];
  const rows = [headerRow];

  // For each tab, create a row with the tab label and the content
  tabPanels.forEach((panel, idx) => {
    // Get the tab label in the same order as the panel
    const label = tabLabels[idx] || `Tab ${idx+1}`;
    // For content: grab the main .contentfragment if present, else all children
    let content = null;
    const cf = panel.querySelector('.contentfragment');
    if (cf) {
      content = cf;
    } else {
      // fallback: use all children except empty text nodes
      const children = Array.from(panel.childNodes).filter(node => {
        return !(node.nodeType === 3 && !node.textContent.trim());
      });
      if (children.length === 1) {
        content = children[0];
      } else if (children.length > 1) {
        content = children;
      } else {
        // fallback to the panel itself
        content = panel;
      }
    }
    rows.push([label, content]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the .cmp-tabs block with this table
  tabs.replaceWith(table);
}
