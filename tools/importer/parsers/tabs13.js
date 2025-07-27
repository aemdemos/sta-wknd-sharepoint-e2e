/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs container
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get all tab labels from the tablist
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  const tabLabels = Array.from(tabList ? tabList.querySelectorAll('li[role="tab"]') : []);

  // Get all tab panels (content)
  const tabPanels = Array.from(tabs.querySelectorAll('.cmp-tabs__tabpanel'));

  // Prepare the table rows
  const rows = [];
  // Header row matches the block/component name exactly
  rows.push(['Tabs (tabs13)']);

  // For each tab, find label and corresponding content
  tabLabels.forEach((tab, idx) => {
    const label = tab.textContent.trim();
    const panel = tabPanels[idx];
    let tabContent = null;
    if (panel) {
      // Only include real tab content, skip empty wrappers
      // Prefer the article element if present
      const article = panel.querySelector('article');
      if (article) {
        tabContent = article;
      } else {
        // fallback, use the panel itself
        tabContent = panel;
      }
    } else {
      tabContent = '';
    }
    rows.push([label, tabContent]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
