/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root
  const tabsRoot = element.querySelector('.tabs.panelcontainer, .cmp-tabs, [class*="tabs"]');
  if (!tabsRoot) return;

  // Find the cmp-tabs element (the main tabs container)
  const cmpTabs = tabsRoot.querySelector('.cmp-tabs') || tabsRoot;
  if (!cmpTabs) return;

  // Get tab labels from the tablist
  const tabLabels = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tablist .cmp-tabs__tab')
  ).map(tab => tab.textContent.trim());

  // Get tab panels (content for each tab)
  const tabPanels = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Defensive: ensure labels and panels match
  if (tabLabels.length !== tabPanels.length) return;

  // Build rows: header, then one row per tab (label, content)
  const rows = [];
  const headerRow = ['Tabs (tabs38)'];
  rows.push(headerRow);

  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    // Defensive: panel may have a single contentfragment/article or just content
    let tabContent = null;
    // Try to find the main content inside the tab panel
    // If there's a contentfragment/article, use it; else, use the panel's children
    const article = panel.querySelector('article');
    if (article) {
      tabContent = article;
    } else {
      // If no article, collect all children
      const children = Array.from(panel.children).filter(
        c => !(c.classList && c.classList.contains('cmp-tabs__tabpanel'))
      );
      if (children.length === 1) {
        tabContent = children[0];
      } else if (children.length > 1) {
        tabContent = children;
      } else {
        // fallback: use panel itself
        tabContent = panel;
      }
    }
    rows.push([label, tabContent]);
  }

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
