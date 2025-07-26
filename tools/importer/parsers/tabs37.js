/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs block
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get tab labels from the tablist (in order)
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  const tabLabels = [];
  if (tabList) {
    tabList.querySelectorAll('[role="tab"]').forEach(tab => {
      tabLabels.push(tab.textContent.trim());
    });
  }

  // Get all tabpanels in order (they correspond to tabs)
  const tabPanels = Array.from(tabs.querySelectorAll('[role="tabpanel"]'));

  // Each row after header: [Tab Label, Tab Content]
  const rows = [];
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    let tabContent = [];
    if (panel) {
      // Collect all non-empty, visible content children (excluding empty grid wrappers)
      // Reference existing elements directly
      panel.childNodes.forEach(child => {
        if (child.nodeType === 1) {
          // Exclude empty grid wrappers
          if (
            child.classList.contains('aem-Grid') ||
            (child.children && child.children.length > 0 && Array.from(child.children).every(grandchild => grandchild.classList && grandchild.classList.contains('aem-GridColumn')))
          ) {
            // skip
          } else {
            tabContent.push(child);
          }
        } else if (child.nodeType === 3 && child.textContent.trim().length) {
          // preserve meaningful text nodes
          tabContent.push(child.textContent);
        }
      });
      // If nothing found, fallback to all children
      if (tabContent.length === 0) {
        Array.from(panel.children).forEach(c => tabContent.push(c));
      }
      // Ensure at least an empty string if empty
      if (tabContent.length === 0) tabContent = [''];
    } else {
      tabContent = [''];
    }
    rows.push([label, tabContent]);
  }

  // Build the table: header and tab rows
  const table = WebImporter.DOMUtils.createTable([
    ['Tabs (tabs37)'],
    ...rows
  ], document);

  // Replace the tabs element with the new table
  tabs.replaceWith(table);
}
