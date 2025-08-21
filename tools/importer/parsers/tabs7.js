/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block within the provided element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get the tab labels from the tab list
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  const tabLabels = [];
  if (tabList) {
    tabList.querySelectorAll('li[role="tab"]').forEach((tabEl) => {
      tabLabels.push(tabEl.textContent.trim());
    });
  }

  // Get all tab panels in proper order
  const tabPanels = tabsBlock.querySelectorAll('.cmp-tabs__tabpanel');

  // Build cells array: header in first row, then each tab label + content
  const cells = [
    ['Tabs (tabs7)'],
  ];

  tabPanels.forEach((panel, idx) => {
    // Tab label
    const label = tabLabels[idx] || `Tab ${idx+1}`;

    // Find the main content for each tab
    // Reference the article.cmp-contentfragment if present, else all children inside the panel
    let tabContent;
    const contentFragment = panel.querySelector('article.cmp-contentfragment') || panel.querySelector('.contentfragment');
    if (contentFragment) {
      tabContent = contentFragment;
    } else {
      // If not present, use all direct children of the panel
      // Avoid including navigation structure or empty grids
      const children = Array.from(panel.childNodes).filter((node) => {
        // Filter out empty text nodes and empty grid containers
        if (node.nodeType === Node.TEXT_NODE && !node.textContent.trim()) return false;
        if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains('aem-Grid')) return false;
        return true;
      });
      if (children.length === 1) {
        tabContent = children[0];
      } else if (children.length > 1) {
        tabContent = children;
      } else {
        tabContent = panel;
      }
    }
    cells.push([label, tabContent]);
  });

  // Create the table
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the tabs block in the DOM
  tabsBlock.replaceWith(table);
}
