/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Find tab labels from <ol> or <ul> in tablist
  const tabList = tabsRoot.querySelector('.cmp-tabs__tablist');
  const tabItems = Array.from(tabList ? tabList.children : []);

  // Find all tabpanels (each tab's content)
  const tabPanels = Array.from(tabsRoot.querySelectorAll('.cmp-tabs__tabpanel'));

  // Prepare header row
  const headerRow = ['Tabs (tabs30)'];
  const cells = [headerRow];

  // For each tab, extract label (first cell) and content (second cell)
  tabItems.forEach(tabItem => {
    const tabLabel = tabItem.textContent.trim();
    // Panel id is linked via aria-controls
    const panelId = tabItem.getAttribute('aria-controls');
    const tabPanel = tabPanels.find(panel => panel.id === panelId);
    let contentCell = null;
    if (tabPanel) {
      // Usually the contentfragment/article has the actual content
      // Sometimes there may be multiple wrappers, so take the main <article> if exists
      const contentFragment = tabPanel.querySelector('article.cmp-contentfragment');
      if (contentFragment) {
        contentCell = contentFragment;
      } else {
        // fallback to the tabPanel itself
        contentCell = tabPanel;
      }
    } else {
      // fallback: empty
      contentCell = '';
    }
    cells.push([tabLabel, contentCell]);
  });

  // Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace tabsRoot with block table
  tabsRoot.replaceWith(block);
}
