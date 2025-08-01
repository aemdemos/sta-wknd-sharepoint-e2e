/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block inside the provided element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get all tab labels from the tablist
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  const tabLabels = [];
  if (tabList) {
    tabList.querySelectorAll('li[role="tab"]').forEach(tabItem => {
      tabLabels.push(tabItem.textContent.trim());
    });
  }

  // Get all tab panels (content areas) in order
  // Note: Only immediate children of .cmp-tabs that are tabpanels (ignore nested tabpanels)
  const tabPanels = [];
  tabsBlock.querySelectorAll('[role="tabpanel"][data-cmp-hook-tabs="tabpanel"]').forEach(panel => {
    // Only include direct children (not nested in another .cmp-tabs)
    let parent = panel.parentElement;
    let foundTabs = false;
    while (parent) {
      if (parent === tabsBlock) { foundTabs = true; break; }
      if (parent.classList && parent.classList.contains('cmp-tabs')) break;
      parent = parent.parentElement;
    }
    if (foundTabs) tabPanels.push(panel);
  });

  // Compose the table rows: header + one row per tab
  const cells = [['Tabs (tabs12)']];

  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    if (!panel) continue;
    // We want to reference the content inside the panel
    // For robustness, put all children of the panel into an array
    let contentElements = [];
    panel.childNodes.forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE || (node.nodeType === Node.TEXT_NODE && node.textContent.trim())) {
        contentElements.push(node);
      }
    });
    if (contentElements.length === 1) {
      contentElements = contentElements[0];
    }
    cells.push([label, contentElements]);
  }

  // Replace the tabs block with the created table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  tabsBlock.replaceWith(table);
}
