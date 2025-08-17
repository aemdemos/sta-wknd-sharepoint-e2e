/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Extract tab labels and tab ids
  const tabList = tabsRoot.querySelector('[role="tablist"]');
  const tabLabels = [];
  const tabIds = [];
  if (tabList) {
    tabList.querySelectorAll('[role="tab"]').forEach(tab => {
      tabLabels.push(tab.textContent.trim());
      tabIds.push(tab.getAttribute('aria-controls'));
    });
  }

  // Collect content for each tab in order (parallel columns)
  const tabContents = tabIds.map(id => {
    const panel = tabsRoot.querySelector(`#${id}`);
    if (!panel) return '';
    // Prefer <article> if present, else all children except script/style/noscript
    const article = panel.querySelector('article');
    if (article) return article;
    const nodes = Array.from(panel.children).filter(el => !['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(el.tagName));
    if (nodes.length === 0) return '';
    if (nodes.length === 1) return nodes[0];
    return nodes;
  });

  // Compose the table: header row, tab labels row, SINGLE content row (parallel columns)
  const cells = [
    ['Tabs (tabs13)'],
    tabLabels,
    tabContents
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
