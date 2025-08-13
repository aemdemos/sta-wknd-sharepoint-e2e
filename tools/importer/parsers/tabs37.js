/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the tabs block
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Table header: exactly as required
  const headerRow = ['Tabs (tabs37)'];

  // Get all tab labels in order
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  const tabLabels = Array.from(tabList ? tabList.querySelectorAll('[role="tab"]') : []);

  // Get all tabpanel content areas in order
  const tabPanels = Array.from(tabs.querySelectorAll('[role="tabpanel"]'));

  const rows = [];

  // Defensive: Only build as many rows as there are tab labels, skip missing if any
  tabLabels.forEach((tab, idx) => {
    const label = tab.textContent.trim();
    // Panel may not exist, fallback to empty div if not found
    let content = document.createElement('div');
    if (tabPanels[idx]) {
      // Prefer the main contentfragment/article if present
      const contentFragment = tabPanels[idx].querySelector('article.cmp-contentfragment');
      content = contentFragment ? contentFragment : tabPanels[idx];
    }
    rows.push([label, content]);
  });

  // Compose the table with the required structure
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original tabs node with the block table
  tabs.replaceWith(table);
}
