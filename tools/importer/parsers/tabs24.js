/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the tabs block
  const tabsEl = element.querySelector('.cmp-tabs');
  if (!tabsEl) return;

  // Header row per spec
  const headerRow = ['Tabs (tabs24)'];

  // Extract tab labels
  const tabList = tabsEl.querySelector('.cmp-tabs__tablist');
  const tabItems = tabList ? Array.from(tabList.querySelectorAll('[role="tab"]')) : [];

  // Map tab items to labels and find their panels
  let rows = [];
  tabItems.forEach(tabItem => {
    const label = tabItem.textContent.trim();
    // Find the corresponding panel
    const controls = tabItem.getAttribute('aria-controls');
    let panel = controls ? tabsEl.querySelector(`#${controls}`) : null;

    // Compose tab content
    let content = '';
    if (panel) {
      // Try to get .contentfragment > article if present
      const contentFragment = panel.querySelector('.contentfragment');
      if (contentFragment) {
        const article = contentFragment.querySelector('article');
        if (article) {
          // Use all children of article except script/style/meta
          content = Array.from(article.children).filter(child => !['SCRIPT','STYLE','META'].includes(child.tagName));
        } else {
          content = [contentFragment];
        }
      } else {
        // fallback: all children of panel
        content = Array.from(panel.children);
      }
    }

    // Add a row for this tab (label, content)
    rows.push([label, content]);
  });

  // Compose the block table
  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the tabs block with the block table
  tabsEl.replaceWith(block);
}
