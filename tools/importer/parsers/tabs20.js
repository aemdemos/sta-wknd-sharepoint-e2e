/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;
  // Get tab labels from the tab list (should be in order)
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  const tabItems = Array.from(tabList ? tabList.children : []);

  // Get all tab panels (should be in the same order as tabItems)
  const tabPanels = Array.from(tabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Compose cells
  const cells = [];
  cells.push(['Tabs (tabs20)']); // Header row
  tabItems.forEach((tab, i) => {
    const label = tab.textContent.trim();
    const panel = tabPanels[i];
    let content;
    if (panel) {
      // Use everything inside .contentfragment, or fallback to panel itself
      const contentfragment = panel.querySelector('.contentfragment');
      if (contentfragment) {
        content = contentfragment;
      } else {
        // fallback: all panel's children
        const fragment = document.createElement('div');
        Array.from(panel.childNodes).forEach(child => fragment.appendChild(child));
        content = fragment;
      }
    } else {
      // no panel, fallback to empty string
      content = '';
    }
    cells.push([label, content]);
  });
  // Create and replace the block
  const block = WebImporter.DOMUtils.createTable(cells, document);
  tabs.replaceWith(block);
}
