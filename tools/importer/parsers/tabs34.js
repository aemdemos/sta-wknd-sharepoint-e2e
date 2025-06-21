/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs element (the main tabs block)
  const tabsWrapper = element.querySelector('.tabs'); // get the highest block-level tab wrapper
  const tabs = tabsWrapper ? tabsWrapper.querySelector('.cmp-tabs') : element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get tab labels
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  const tabItems = tabList ? Array.from(tabList.children) : [];

  // Get tab panels
  const tabPanels = Array.from(tabs.querySelectorAll('.cmp-tabs__tabpanel'));

  // Compose header row: block name in single column
  const rows = [ ['Tabs (tabs34)'] ];

  // Each subsequent row: [Tab Label, Tab Content]
  for (let i = 0; i < tabItems.length; i++) {
    const label = tabItems[i].textContent.trim();
    // Reference the panel content -- always use the article.cmp-contentfragment if present
    const panel = tabPanels[i];
    let content = '';
    if (panel) {
      const article = panel.querySelector('article.cmp-contentfragment');
      content = article || panel;
    }
    rows.push([label, content]);
  }

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the highest block-level tab wrapper if possible, else just replace cmp-tabs
  if (tabsWrapper && tabsWrapper.parentNode) {
    tabsWrapper.replaceWith(block);
  } else {
    tabs.replaceWith(block);
  }
}
