/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get all tab labels (li elements in the tablist)
  const tabLabels = Array.from(tabsRoot.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get all tab panels (divs with role="tabpanel")
  const tabPanels = Array.from(tabsRoot.querySelectorAll('[role="tabpanel"]'));

  // Defensive: ensure we have the same number of labels and panels
  if (tabLabels.length !== tabPanels.length) return;

  // Build the table rows
  const rows = [];
  // Header row as required
  rows.push(['Tabs (tabs17)']);

  // For each tab, add a row: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];
    // Defensive: find the actual content inside the tab panel
    // Usually a .contentfragment or similar
    let content = null;
    // Prefer the first child that is not a script or style
    for (const child of panel.children) {
      if (child.nodeType === 1 && child.tagName !== 'SCRIPT' && child.tagName !== 'STYLE') {
        content = child;
        break;
      }
    }
    // Fallback: use the panel itself if no child
    if (!content) content = panel;
    rows.push([label, content]);
  }

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original tabs block with the table
  tabsRoot.replaceWith(table);
}
