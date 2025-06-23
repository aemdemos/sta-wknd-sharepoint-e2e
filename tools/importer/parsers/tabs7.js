/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the tabs block
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Grab the tab labels in order
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.children).map(li => li.textContent.trim());

  // Find all tab panels (in order)
  const tabPanels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tabpanel'));

  // Compose the block's rows
  // Header row must be exactly one column as specified
  const rows = [
    ['Tabs (tabs7)'], // Header row: exactly one cell
  ];

  // Each tab is a row: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    let contentEl = null;
    if (panel) {
      // Use the main contentfragment/article if present, else use the panel itself
      const mainCf = panel.querySelector('article.cmp-contentfragment');
      if (mainCf) {
        contentEl = mainCf;
      } else {
        // Sometimes content might be inside a .contentfragment
        const cfWrap = panel.querySelector('.contentfragment');
        if (cfWrap) {
          contentEl = cfWrap;
        } else {
          // fallback: use panel itself
          contentEl = panel;
        }
      }
    }
    // Push row: (tab label, reference to existing content node)
    rows.push([label, contentEl]);
  }

  // Create table and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
