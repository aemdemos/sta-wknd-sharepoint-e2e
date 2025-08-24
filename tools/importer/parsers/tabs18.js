/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get tab labels from tablist <ol>
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  const tabLabels = [];
  if (tabList) {
    tabList.querySelectorAll('[role="tab"]').forEach(tab => {
      tabLabels.push(tab.textContent.trim());
    });
  }

  // Get tab panels in correct order
  const tabPanels = Array.from(
    tabs.querySelectorAll('[role="tabpanel"][data-cmp-hook-tabs="tabpanel"]')
  );

  // Build rows for the Tabs block table
  const rows = [];
  // Header row matches exactly
  rows.push(['Tabs (tabs18)']);

  // For each tab, add [label, content] row
  tabPanels.forEach((panel, idx) => {
    // Get the label: correctly indexed
    const label = tabLabels[idx] || '';

    // Try to reference the .contentfragment inside each tab panel
    let contentFragment = panel.querySelector('.contentfragment');
    let tabContent;
    if (contentFragment) {
      // Reference the article (or all children)
      tabContent = contentFragment;
    } else {
      // Fallback: use all children except empty grid
      const children = Array.from(panel.children).filter(child => {
        // Remove empty grid containers
        if (child.classList.contains('aem-Grid') && !child.textContent.trim()) return false;
        return true;
      });
      tabContent = children.length > 0 ? children : panel;
    }

    rows.push([label, tabContent]);
  });

  // Create the block table and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
