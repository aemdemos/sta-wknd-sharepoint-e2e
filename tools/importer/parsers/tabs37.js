/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs element inside the given element
  let tabsEl = element.querySelector('.cmp-tabs');
  if (!tabsEl) return;

  // Get the tab list
  const tabList = tabsEl.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('.cmp-tabs__tab'));

  // Get all tab panels (order must match tab labels)
  const tabPanels = Array.from(tabsEl.querySelectorAll('.cmp-tabs__tabpanel'));

  // Prepare rows for the block table
  const rows = [];
  // Always use the block name as header (exact)
  rows.push(['Tabs (tabs37)']);

  // For each tab, extract label and main panel content
  const nTabs = Math.min(tabLabels.length, tabPanels.length);
  for (let i = 0; i < nTabs; i++) {
    const labelText = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];
    
    // For the tab content, we include all children of the main content fragment/article
    // Prefer to reference the existing article/contentfragment element
    let tabContent;
    // Try to find the article
    const article = panel.querySelector('article');
    if (article) {
      tabContent = article;
    } else {
      // fallback: reference all children of the tab panel
      // If there is only one element, use it; else, use a div wrapper
      const children = Array.from(panel.children);
      if (children.length === 1) {
        tabContent = children[0];
      } else if (children.length > 1) {
        const wrapper = document.createElement('div');
        children.forEach(child => wrapper.appendChild(child));
        tabContent = wrapper;
      } else {
        // fallback: empty div
        tabContent = document.createElement('div');
      }
    }
    rows.push([labelText, tabContent]);
  }

  const table = WebImporter.DOMUtils.createTable(rows, document);
  tabsEl.replaceWith(table);
}
