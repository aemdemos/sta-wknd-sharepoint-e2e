/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs element: the main tabs block
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;
  
  // Get all tab labels, in order
  const tablist = tabs.querySelector('.cmp-tabs__tablist');
  const tabLabels = [];
  if (tablist) {
    tablist.querySelectorAll('li[role="tab"]').forEach(tab => {
      tabLabels.push(tab.textContent.trim());
    });
  }
  
  // Get all tab panels, in order
  const panels = tabs.querySelectorAll('.cmp-tabs__tabpanel');

  // Build the rows for the block table: first row is the header, then each tab as [label, content]
  const rows = [['Tabs (tabs6)']];
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = panels[i];
    if (!panel) continue;
    // Try to get the .contentfragment if present, else use all children of the panel
    let content = null;
    const contentFragment = panel.querySelector('.contentfragment');
    if (contentFragment) {
      content = contentFragment;
    } else {
      // fallback: collect all panel children as an array
      const children = Array.from(panel.childNodes).filter(n => !(n.nodeType === 3 && n.textContent.trim() === ''));
      content = children.length === 1 ? children[0] : children;
    }
    rows.push([label, content]);
  }
  
  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the entire tabs block with the table (replace the .cmp-tabs element)
  tabs.replaceWith(block);
}
