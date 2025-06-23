/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs block inside the provided element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get the tab labels
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  const tabLabels = [];
  if (tabList) {
    tabList.querySelectorAll('[role="tab"]').forEach(tab => {
      tabLabels.push(tab.textContent.trim());
    });
  }

  // Get all tab panels (one per tab)
  const tabPanels = tabsBlock.querySelectorAll('.cmp-tabs__tabpanel');

  // Defensive: If the number of panels doesn't match tab labels, return; nothing to parse
  if (tabLabels.length === 0 || tabPanels.length !== tabLabels.length) return;

  // Build the table header row, as in the block spec
  const headerRow = ['Tabs (tabs25)'];

  // For each tab, get its label and content, referencing existing elements from the DOM
  const rows = [headerRow];

  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const tabpanel = tabPanels[i];

    // To grab the content: 
    // Try to find an article (contentfragment) as a direct descendent
    let tabContent = null;
    const contentFragment = tabpanel.querySelector('article');
    if (contentFragment) {
      // We want to preserve all children except the .cmp-contentfragment__title (usually h3)
      const children = Array.from(contentFragment.children).filter(child => !child.classList.contains('cmp-contentfragment__title'));
      // If only one child, use it; else, an array
      tabContent = children.length === 1 ? children[0] : children;
    } else {
      // Fallback: grab all children of tabpanel
      tabContent = Array.from(tabpanel.children);
      if (tabContent.length === 1) tabContent = tabContent[0];
    }
    rows.push([label, tabContent]);
  }

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  tabsBlock.replaceWith(table);
}
