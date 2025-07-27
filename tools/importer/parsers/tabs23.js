/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block container (.cmp-tabs) in the given element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Extract tab labels and map them to their associated tabpanel IDs
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  const tabEntries = [];
  if (tabList) {
    tabList.querySelectorAll('li[role="tab"]').forEach((tabEl) => {
      const label = tabEl.textContent.trim();
      const panelId = tabEl.getAttribute('aria-controls');
      tabEntries.push({ label, panelId });
    });
  }

  // Compose the rows for the block table
  const rows = [['Tabs (tabs23)']];

  tabEntries.forEach(({ label, panelId }) => {
    // Locate panel content by panelId
    const panelEl = tabsBlock.querySelector(`#${panelId}`);
    let tabContent = '';
    if (panelEl) {
      // Find the main content for the tab. Usually, there's a .contentfragment article inside the panel
      // If not, fallback to all direct children of panelEl
      // Always reference original elements, do not clone.
      let primaryContent = null;
      const article = panelEl.querySelector('article');
      if (article) {
        primaryContent = article;
      } else {
        // Use all direct children (excluding empty text nodes)
        const children = Array.from(panelEl.children).filter(c => c.tagName !== 'SCRIPT' && c.tagName !== 'STYLE');
        if (children.length === 1) {
          primaryContent = children[0];
        } else if (children.length > 1) {
          primaryContent = children;
        } else {
          primaryContent = panelEl;
        }
      }
      tabContent = primaryContent;
    }
    rows.push([label, tabContent]);
  });

  // Create the block table using the extracted rows
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original tabs block element with the new table
  tabsBlock.replaceWith(table);
}
