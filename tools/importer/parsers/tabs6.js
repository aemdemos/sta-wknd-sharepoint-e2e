/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs container (.cmp-tabs)
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get the tablist (tab labels)
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabelElements = Array.from(tabList.querySelectorAll('li'));
  if (!tabLabelElements.length) return;

  // Get tab labels in order
  const tabLabels = tabLabelElements.map(tab => tab.textContent.trim());

  // Get tab panels in order (by DOM order)
  const tabPanels = Array.from(tabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));
  if (tabPanels.length !== tabLabels.length) return;

  // Prepare the table rows
  const cells = [];
  // First row: block header (single cell)
  cells.push(['Tabs (tabs6)']);

  // Each following row: [tab label, tab content]
  for (let i = 0; i < tabLabels.length; i += 1) {
    // Tab label
    const label = tabLabels[i];
    // Tab content
    // If there is a contentfragment inside, reference that; otherwise, use all meaningful children
    const panel = tabPanels[i];
    const cf = panel.querySelector('.contentfragment');
    let content;
    if (cf) {
      content = cf;
    } else {
      // Filter out empty divs, script, style, and whitespace-only text nodes
      const nodes = Array.from(panel.childNodes).filter(node => {
        if (node.nodeType === 1) {
          // Element node
          if (
            (node.tagName === 'DIV' && node.textContent.trim() === '' && node.children.length === 0) ||
            node.tagName === 'SCRIPT' || node.tagName === 'STYLE'
          ) return false;
          return true;
        } else if (node.nodeType === 3) {
          // Text node: must have content
          return node.textContent.trim().length > 0;
        }
        return false;
      });
      if (nodes.length === 1) content = nodes[0];
      else if (nodes.length > 1) content = nodes;
      else content = panel; // fallback
    }
    cells.push([label, content]);
  }

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  tabs.replaceWith(block);
}
