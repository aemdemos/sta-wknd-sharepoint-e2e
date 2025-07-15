/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs container
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Find tab labels
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  const tabLabels = tabList ? Array.from(tabList.querySelectorAll('[role="tab"]')) : [];
  // Find tab contents (panels)
  const tabPanels = tabs.querySelectorAll('.cmp-tabs__tabpanel');

  // Compose the table: only block name row, then one row per tab (label, content)
  const cells = [ ['Tabs (tabs3)'] ];

  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i]?.textContent.trim() || '';
    let content = '';
    const panel = tabPanels[i];
    if (panel) {
      // Prefer referencing a contentfragment inside the panel
      const cf = panel.querySelector('.contentfragment, .cmp-contentfragment');
      if (cf) {
        content = cf;
      } else {
        // Use all non-empty children
        const children = Array.from(panel.childNodes).filter(n => (n.nodeType === 1) || (n.nodeType === 3 && n.textContent.trim()));
        if (children.length === 1) {
          content = children[0];
        } else if (children.length > 1) {
          content = children;
        }
      }
    }
    cells.push([label, content]);
  }

  const block = WebImporter.DOMUtils.createTable(cells, document);
  tabs.replaceWith(block);
}
