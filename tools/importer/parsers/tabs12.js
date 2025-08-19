/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs block in the given element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get all tab labels (li[role="tab"]) in order
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  const tabLabels = [];
  if (tabList) {
    tabList.querySelectorAll('li[role="tab"]').forEach(tab => {
      tabLabels.push(tab.textContent.trim());
    });
  }

  // Get all tab panels in order
  const tabPanels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tabpanel'));

  // Defensive: skip if mismatch
  if (tabLabels.length !== tabPanels.length || tabLabels.length === 0) return;

  // Compose table rows
  const cells = [];
  // Header row as required ('Tabs (tabs12)')
  cells.push(['Tabs (tabs12)']);

  // For each tab, extract [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];

    // Extract the content area
    let content = null;
    // Usually it's a .contentfragment, but not always
    const cf = panel.querySelector('.contentfragment');
    if (cf) {
      content = cf;
    } else {
      // fallback: use all children of the panel
      const wrap = document.createElement('div');
      Array.from(panel.childNodes).forEach(node => wrap.appendChild(node));
      content = wrap;
    }
    cells.push([label, content]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original tabs block in the DOM
  tabsBlock.replaceWith(table);
}
