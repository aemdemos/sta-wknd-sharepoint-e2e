/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block within the given element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get tab labels from the tablist
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  const tabLabelEls = tabList ? Array.from(tabList.querySelectorAll('[role="tab"]')) : [];
  const tabLabels = tabLabelEls.map(tabEl => tabEl.textContent.trim());

  // Get all tab panels (tab content elements)
  const tabPanelEls = Array.from(tabs.querySelectorAll('[role="tabpanel"]'));

  // Build the table rows
  const rows = [];
  // Header row: exactly one cell with the tab block name
  rows.push(['Tabs (tabs6)']);

  // For each tab, add a row [Tab Label, Tab Content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const contentPanel = tabPanelEls[i];
    let tabContent;
    if (contentPanel) {
      // Reference all direct children of the tabpanel (these are typically the main content blocks)
      const children = Array.from(contentPanel.children).filter(child => {
        // Ignore empty grid containers
        if (
          child.children.length === 1 &&
          child.firstElementChild &&
          child.firstElementChild.classList.contains('aem-Grid') &&
          child.firstElementChild.children.length === 0
        ) {
          return false;
        }
        return true;
      });
      if (children.length === 1) {
        tabContent = children[0];
      } else if (children.length > 1) {
        tabContent = children;
      } else {
        // Fallback: include all childNodes (for possible text nodes)
        tabContent = Array.from(contentPanel.childNodes).filter(n => n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim() !== ''));
        if (tabContent.length === 1) tabContent = tabContent[0];
      }
    } else {
      tabContent = '';
    }
    rows.push([label, tabContent]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabs element with the new block table
  tabs.replaceWith(table);
}
