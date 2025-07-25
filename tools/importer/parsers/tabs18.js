/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs block inside the provided element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get the tab labels from the tablist (li elements)
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabelEls = Array.from(tabList.querySelectorAll('li'));
  const tabLabels = tabLabelEls.map(li => li.textContent.trim());

  // Get tabpanel elements for each tab, in the same order as the tab labels
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // For each tab, collect its content as a single cell (reference article's children except h3, or fallback to tabPanel's children)
  const tabContents = tabPanels.map(tabPanel => {
    const article = tabPanel.querySelector('article');
    if (article) {
      // Collect all children of article except h3.cmp-contentfragment__title
      const contentNodes = [];
      for (const child of Array.from(article.children)) {
        if (!(child.tagName === 'H3' && child.classList.contains('cmp-contentfragment__title'))) {
          contentNodes.push(child);
        }
      }
      if (contentNodes.length > 0) {
        return contentNodes;
      }
    }
    // fallback: use panel's children
    return Array.from(tabPanel.childNodes);
  });

  // Table structure:
  // Row 1: 1 cell: header
  // Row 2: N cells: tab labels
  // Row 3: N cells: tab content for each tab (in matching order, all in one row)
  const cells = [
    ['Tabs (tabs18)'],
    tabLabels,
    tabContents
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  tabsBlock.replaceWith(table);
}
