/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the tabs block root
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get tab labels (in order)
  const tabList = tabsRoot.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('.cmp-tabs__tab'));

  // Get tab panels (in order)
  const tabPanels = Array.from(tabsRoot.querySelectorAll('.cmp-tabs__tabpanel'));

  // Defensive: match tab labels to tab panels by order
  const rows = [];
  const headerRow = ['Tabs (tabs3)']; // CRITICAL: Block name as header
  rows.push(headerRow);

  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const labelText = label.textContent.trim();
    const panel = tabPanels[i];
    if (!panel) continue;

    // Extract tab content: reference the actual content node
    // Find the main content node inside the tabpanel (usually .contentfragment)
    let tabContent = null;
    for (const child of panel.children) {
      if (child.nodeType === 1 && child.tagName !== 'SCRIPT' && child.tagName !== 'STYLE') {
        tabContent = child;
        break;
      }
    }
    // Fallback: use the panel itself if no child found
    tabContent = tabContent || panel;

    // Always reference the actual DOM node, do not clone or create new elements
    rows.push([labelText, tabContent]);
  }

  // Create the table block and replace the original tabs block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  tabsRoot.replaceWith(table);
}
