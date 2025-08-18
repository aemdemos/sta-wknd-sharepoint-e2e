/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;
  
  // Get tab labels from the tablist (ol > li)
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  const tabLabels = tabList ? Array.from(tabList.children).map(li => li.textContent.trim()) : [];
  
  // Get tab panels (content for each tab)
  const tabPanels = Array.from(tabs.querySelectorAll('.cmp-tabs__tabpanel'));
  
  // Table header: block name as in example
  const headerRow = ['Tabs (tabs31)', ''];
  const cells = [headerRow];

  // For each tab, extract label and content
  tabPanels.forEach((tabpanel, idx) => {
    // Tab label from list, fallback if missing
    const label = tabLabels[idx] || `Tab ${idx + 1}`;
    // For content, reference all direct children of tabpanel
    // Usually a contentfragment > article, but be flexible to variations
    let contentEls = [];
    // Prefer contentfragment/article if present
    const contentFragment = tabpanel.querySelector('article.cmp-contentfragment');
    if (contentFragment) {
      contentEls = [contentFragment];
    } else {
      // Get all non-empty child nodes (keep semantic structure)
      contentEls = Array.from(tabpanel.childNodes).filter(node => {
        return node.nodeType === Node.ELEMENT_NODE
          || (node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0);
      });
    }
    // Use the element or array as table cell
    cells.push([label, contentEls.length === 1 ? contentEls[0] : contentEls]);
  });

  // Create the table and replace tabs block
  const table = WebImporter.DOMUtils.createTable(cells, document);
  tabs.replaceWith(table);
}
