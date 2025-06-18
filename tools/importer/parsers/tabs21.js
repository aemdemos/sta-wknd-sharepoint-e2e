/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block element
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get tab labels in order
  const tabList = tabsRoot.querySelector('.cmp-tabs__tablist');
  const tabLabels = tabList ? Array.from(tabList.querySelectorAll('[role="tab"]')).map(li => li.textContent.trim()) : [];

  // Get all tab panels (divs with [role=tabpanel]), in order
  const tabPanels = Array.from(tabsRoot.querySelectorAll('[role="tabpanel"]'));

  // Compose the header row (single cell, per spec)
  const headerRow = ['Tabs (tabs21)'];

  // Compose rows: each tab is a row of [tab label, tab content]
  const contentRows = tabPanels.map((panel, idx) => {
    // Get tab label
    const label = tabLabels[idx] || `Tab ${idx+1}`;
    // Get tab content
    let tabContent = null;
    const contentFragment = panel.querySelector('article.cmp-contentfragment');
    if (contentFragment) {
      tabContent = contentFragment;
    } else {
      // fallback: gather all element children
      const panelChildren = Array.from(panel.children);
      if (panelChildren.length === 1) {
        tabContent = panelChildren[0];
      } else if (panelChildren.length > 1) {
        tabContent = panelChildren;
      } else {
        tabContent = '';
      }
    }
    return [label, tabContent];
  });

  // Combine header and rows
  const rows = [headerRow, ...contentRows];

  // Create block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace original element with the tabs block table
  element.replaceWith(table);
}
