/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs component in the given element
  const tabsContainer = element.querySelector('.cmp-tabs');
  if (!tabsContainer) return;

  // Get the tab labels
  const tabList = tabsContainer.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('[role="tab"]'));
  // Get the tab panels and map by id
  const tabPanels = Array.from(tabsContainer.querySelectorAll('[role="tabpanel"]'));
  const panelByTabId = {};
  tabPanels.forEach(panel => {
    const tabId = panel.getAttribute('aria-labelledby');
    if (tabId) {
      panelByTabId[tabId] = panel;
    }
  });
  // Assemble rows: first row is the header
  const rows = [['Tabs (tabs38)']];
  tabLabels.forEach(tabLabel => {
    const labelText = tabLabel.textContent.trim();
    // Get the corresponding panel
    const panel = panelByTabId[tabLabel.id];
    let contentCell = '';
    if (panel) {
      // Try to use the main article (contentfragment), if available
      const mainArticle = panel.querySelector('article.cmp-contentfragment');
      if (mainArticle) {
        contentCell = mainArticle;
      } else {
        // If no article is present, use the children of the panel
        // Reference the panel element itself, not a clone
        contentCell = panel;
      }
    }
    rows.push([labelText, contentCell]);
  });
  // Create and replace block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  tabsContainer.parentNode.replaceChild(block, tabsContainer);
}
