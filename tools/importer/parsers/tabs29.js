/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get tab labels
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabelEls = tabList.querySelectorAll('.cmp-tabs__tab');

  // Get tab panels (order corresponds to tab labels)
  const tabPanels = tabs.querySelectorAll('.cmp-tabs__tabpanel');
  if (tabLabelEls.length === 0 || tabPanels.length === 0) return;

  // Header row (single column)
  const headerRow = ['Tabs (tabs29)'];

  // Tab names row (one column for each tab)
  const tabNamesRow = Array.from(tabLabelEls).map(tab => tab.textContent.trim());

  // Tab content row (one column for each tab)
  const tabContentRow = Array.from(tabPanels).map(panel => {
    // Try to get the most meaningful content for the tab
    // Prefer .contentfragment > .cmp-contentfragment__elements if available
    let contentFragment = panel.querySelector('.contentfragment');
    let contentElement = null;
    if (contentFragment) {
      const cfElements = contentFragment.querySelector('.cmp-contentfragment__elements');
      if (cfElements) {
        // Remove all empty .aem-Grid wrappers from cfElements
        const fragment = document.createDocumentFragment();
        Array.from(cfElements.childNodes).forEach(child => {
          if (
            child.nodeType === 1 &&
            child.classList &&
            child.classList.contains('aem-Grid') &&
            child.childElementCount === 0
          ) {
            return;
          }
          fragment.appendChild(child);
        });
        if (fragment.childNodes.length > 0) {
          contentElement = Array.from(fragment.childNodes);
        } else {
          contentElement = [cfElements];
        }
      } else {
        // fallback: remove empty aem-Grid wrappers from contentFragment
        const fragment = document.createDocumentFragment();
        Array.from(contentFragment.children).forEach(child => {
          if (
            child.classList &&
            child.classList.contains('aem-Grid') &&
            child.childElementCount === 0
          ) {
            return;
          }
          fragment.appendChild(child);
        });
        if (fragment.childNodes.length > 0) {
          contentElement = Array.from(fragment.childNodes);
        } else {
          contentElement = [contentFragment];
        }
      }
    } else {
      // fallback: use panel directly, remove empty aem-Grid wrappers
      const fragment = document.createDocumentFragment();
      Array.from(panel.children).forEach(child => {
        if (
          child.classList &&
          child.classList.contains('aem-Grid') &&
          child.childElementCount === 0
        ) {
          return;
        }
        fragment.appendChild(child);
      });
      if (fragment.childNodes.length > 0) {
        contentElement = Array.from(fragment.childNodes);
      } else {
        contentElement = [panel];
      }
    }
    return contentElement;
  });

  // Compose the table: header, tab labels, one tab content row
  const cells = [
    headerRow,
    tabNamesRow,
    tabContentRow
  ];

  // Create the block table and replace the original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
