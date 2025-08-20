/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.tabs .cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels
  const tabLabels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get tab panels
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));
  const numTabs = Math.min(tabLabels.length, tabPanels.length);

  // Header row: a single-column row, matching the example
  const rows = [['Tabs (tabs9)']];

  // Each tab: 2 columns: [Tab Label, Tab Content]
  for (let i = 0; i < numTabs; i++) {
    const label = tabLabels[i]?.textContent?.trim() || '';
    const panel = tabPanels[i];
    // Find the main contentfragment/article or use the panel
    let mainContent = panel.querySelector('article, .cmp-contentfragment');
    if (!mainContent) mainContent = panel;
    // Filter out empty grid divs and empty text nodes
    const filterNodes = (node) => {
      if (
        node.nodeType === 1 &&
        node.classList &&
        /aem-Grid/.test(node.className) &&
        node.childNodes.length === 0
      ) return false;
      if (node.nodeType === 3 && !node.textContent.trim()) return false;
      return true;
    };
    let contentNodes = Array.from(mainContent.childNodes).filter(filterNodes);
    if (!contentNodes.length) {
      contentNodes = Array.from(panel.childNodes).filter(filterNodes);
    }
    let tabContent = contentNodes.length === 0 ? panel : (contentNodes.length === 1 ? contentNodes[0] : contentNodes);
    rows.push([label, tabContent]);
  }

  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the tabs block with the table
  tabsBlock.replaceWith(block);
}
