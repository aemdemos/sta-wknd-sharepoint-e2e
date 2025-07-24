/* global WebImporter */
export default function parse(element, { document }) {
  // Find the relevant .cmp-tabs element inside the provided element
  const tabsContainer = element.querySelector('.cmp-tabs');
  if (!tabsContainer) return;

  // Get the tab labels and tab ids from the tablist (in order)
  const tabList = tabsContainer.querySelector('[role="tablist"]');
  let tabLabels = [];
  let tabIds = [];
  if (tabList) {
    const tabs = Array.from(tabList.querySelectorAll('[role="tab"]'));
    tabLabels = tabs.map(tab => tab.textContent.trim());
    tabIds = tabs.map(tab => tab.getAttribute('aria-controls'));
  }

  // Each tab panel is associated with one of these ids.
  // For each, get the content (reference the main fragment element or all content)
  let tabContents = [];
  tabIds.forEach(tabpanelId => {
    let panel = tabsContainer.querySelector(`#${tabpanelId}`);
    if (!panel) {
      tabContents.push('');
      return;
    }
    // Normally the content is inside .contentfragment or .cmp-contentfragment
    let content = panel.querySelector('.contentfragment, .cmp-contentfragment');
    if (!content) {
      // Fallback: reference all children
      const container = document.createElement('div');
      Array.from(panel.childNodes).forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.TEXT_NODE) {
          container.appendChild(node);
        }
      });
      content = container;
    }
    tabContents.push(content);
  });

  // Compose table: header row, label row, content row
  const cells = [
    ['Tabs (tabs11)'],
    tabLabels,
    tabContents
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
