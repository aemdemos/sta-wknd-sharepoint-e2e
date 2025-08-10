/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block within the given element
  const tabsContainer = element.querySelector('.tabs');
  if (!tabsContainer) return;
  const tabs = tabsContainer.querySelector('.cmp-tabs');
  if (!tabs) return;

  // 1. Extract the tab labels in order
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  const tabLabelEls = Array.from(tabList ? tabList.querySelectorAll('li[role="tab"]') : []);
  // 2. For each tab, find the corresponding tabpanel content
  const rows = [];
  // Header row per requirements
  rows.push(['Tabs (tabs10)']);

  tabLabelEls.forEach((tabLabelEl) => {
    const label = tabLabelEl.textContent.trim();
    const panelId = tabLabelEl.getAttribute('aria-controls');
    // The panel may not exist, be robust
    const tabPanel = panelId ? tabs.querySelector(`#${panelId}`) : null;
    let content = null;
    if (tabPanel) {
      // Prefer the .contentfragment inside the tab panel if possible
      const cf = tabPanel.querySelector('.contentfragment');
      if (cf) {
        content = cf;
      } else {
        // If not present, use the tabPanel itself
        content = tabPanel;
      }
    } else {
      // Fallback: empty cell (should not happen in valid markup)
      content = document.createTextNode('');
    }
    rows.push([label, content]);
  });

  // Create the table using the helper
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the whole tabs block (tabsContainer) with the table
  tabsContainer.parentNode.replaceChild(table, tabsContainer);
}
