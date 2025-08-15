/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Find tab labels from tablist
  const tabList = tabsRoot.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('li')).map(li => li.textContent.trim());

  // Find tab panels (in order)
  const tabPanels = Array.from(tabsRoot.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));
  if (tabLabels.length !== tabPanels.length || tabLabels.length === 0) return;

  // Header row: block name only, single column
  const headerRow = ['Tabs (tabs36)'];

  // Each row: [tab label, tab content]
  const rows = tabLabels.map((label, idx) => {
    const panel = tabPanels[idx];
    // Find the article in the panel, else use the panel's direct children (as fallback)
    let tabContent;
    const article = panel.querySelector('article');
    if (article) {
      tabContent = article;
    } else {
      // Only meaningful children
      const meaningfulChildren = Array.from(panel.children).filter(child => {
        if (child.classList.contains('aem-Grid')) return false;
        if (child.tagName === 'SCRIPT' || child.tagName === 'STYLE') return false;
        if (child.textContent.trim() === '' && child.querySelectorAll('img, p, h1, h2, h3, h4, h5, h6, ul, ol').length === 0) return false;
        return true;
      });
      tabContent = meaningfulChildren.length === 1 ? meaningfulChildren[0] : meaningfulChildren;
    }
    return [label, tabContent];
  });

  // Table cells: first row is header (single cell), then tab rows (two cells)
  const cells = [headerRow, ...rows];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
