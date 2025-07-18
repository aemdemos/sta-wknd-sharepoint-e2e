/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cmp-tabs element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels and panels in order
  const tabLabels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab'));
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));
  
  // Build table cells array
  const cells = [['Tabs (tabs36)']];
  tabLabels.forEach((tabLabel, idx) => {
    const label = tabLabel.textContent.trim();
    const panel = tabPanels[idx];
    // Prefer an article.cmp-contentfragment if present, otherwise the panel itself
    const contentNode = panel.querySelector('article.cmp-contentfragment') || panel;
    cells.push([label, contentNode]);
  });

  const block = WebImporter.DOMUtils.createTable(cells, document);
  tabsBlock.replaceWith(block);
}
