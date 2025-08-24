/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs block inside the given element
  const tabsWrapper = element.querySelector('.cmp-tabs');
  if (!tabsWrapper) return;

  // Get the <ol> list of tab labels
  const tabList = tabsWrapper.querySelector('.cmp-tabs__tablist');
  const tabLabels = tabList ? Array.from(tabList.querySelectorAll('li')).map(li => li.textContent.trim()) : [];

  // Get all tabpanel divs (one per tab)
  const tabPanels = Array.from(tabsWrapper.querySelectorAll('.cmp-tabs__tabpanel'));

  // Table header must exactly match the example
  const headerRow = ['Tabs (tabs20)'];
  const cells = [headerRow];

  // Build table rows for each tab
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    if (!panel) continue;

    // Tab content: find the primary block of content for robustness
    let tabContent;
    // Usually an article.cmp-contentfragment is inside
    tabContent = panel.querySelector('article.cmp-contentfragment');
    if (!tabContent) {
      // Sometimes just a div.contentfragment
      tabContent = panel.querySelector('div.contentfragment');
    }
    if (!tabContent) {
      // Or fallback to panel's first child
      tabContent = panel.firstElementChild ? panel.firstElementChild : panel;
    }
    cells.push([
      label,
      tabContent
    ]);
  }

  // Only one block is required, and no Section Metadata table is in the example
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
