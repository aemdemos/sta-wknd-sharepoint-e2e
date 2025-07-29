/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cmp-tabs block inside the element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Extract tab labels from the tablist
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;

  const tabLabels = Array.from(tabList.querySelectorAll('[role="tab"]'))
    .map(tab => tab.textContent.trim());

  // Extract tab content panels (cmp-tabs__tabpanel)
  const panels = tabLabels.map((_, i) => {
    // The tabpanel order matches the tab order
    return tabsBlock.querySelectorAll('.cmp-tabs__tabpanel')[i];
  });

  if (tabLabels.length !== panels.length) return;

  // Build the cells
  // First row: block header
  const cells = [
    ['Tabs (tabs20)']
  ];

  // Each row: [tab label, tab content]
  for (let i = 0; i < tabLabels.length; i++) {
    const tabLabel = tabLabels[i];
    const panel = panels[i];
    // Defensive: skip if no panel
    if (!panel) continue;
    // For resilience: get all childNodes that are not empty text nodes
    const nodes = Array.from(panel.childNodes).filter(node => {
      if (node.nodeType === Node.TEXT_NODE && !node.textContent.trim()) return false;
      return true;
    });
    let content;
    if (nodes.length === 1) {
      content = nodes[0];
    } else {
      const fragment = document.createDocumentFragment();
      nodes.forEach(n => fragment.appendChild(n));
      content = fragment;
    }
    cells.push([tabLabel, content]);
  }

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
