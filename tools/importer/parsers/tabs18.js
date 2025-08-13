/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block element (cmp-tabs)
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get all tab labels from the tablist
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  const tabLabels = [];
  if (tabList) {
    const tabItems = tabList.querySelectorAll('li[role="tab"]');
    tabItems.forEach(tab => {
      tabLabels.push(tab.textContent.trim());
    });
  }

  // Get all tab panels (content)
  // They appear in DOM order corresponding to tabLabels
  const tabPanels = tabsBlock.querySelectorAll('[role="tabpanel"][data-cmp-hook-tabs="tabpanel"]');

  // Each tab row: [Label, Content]
  const rows = [];
  for (let i = 0; i < tabLabels.length && i < tabPanels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    // Compose tab content preserving all relevant content
    // Reference the article (if present), else reference all meaningful child nodes
    let contentNodes = [];
    const article = panel.querySelector('article');
    if (article) {
      contentNodes.push(article);
    } else {
      // fallback: all direct children that are elements
      contentNodes = Array.from(panel.children);
    }
    // If there is only one content node, put that, else the array
    const contentCell = contentNodes.length === 1 ? contentNodes[0] : contentNodes;
    rows.push([label, contentCell]);
  }

  // Compose the table array
  const cells = [
    ['Tabs (tabs18)'], // Header row matches block name
    ...rows
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
