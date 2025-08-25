/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the tabs block in the given element
  const tabsContainer = element.querySelector('.cmp-tabs');
  if (!tabsContainer) return;

  // Get all tab labels
  const tabLabels = [];
  const tablist = tabsContainer.querySelector('.cmp-tabs__tablist');
  if (tablist) {
    tablist.querySelectorAll('li[role="tab"]').forEach(tab => {
      tabLabels.push(tab.textContent.trim());
    });
  }

  // Get all tab panels (content for each tab)
  const tabPanels = Array.from(tabsContainer.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Compose table rows
  const cells = [];
  cells.push(['Tabs (tabs38)']);

  // Each tab row: label, tab content (reference existing block)
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    if (!panel) continue;
    // Use the .contentfragment element if present, else panel itself
    let content;
    const fragment = panel.querySelector('.contentfragment');
    if (fragment) {
      content = fragment;
    } else {
      content = panel;
    }
    cells.push([label, content]);
  }

  // Create and replace the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  tabsContainer.replaceWith(block);
}
