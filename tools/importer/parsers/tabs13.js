/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cmp-tabs block in the element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get the tab labels from the tablist (usually <ol> of <li>)
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  const tabLabels = [];
  if (tabList) {
    tabList.querySelectorAll('li[role="tab"]').forEach(li => {
      tabLabels.push(li.textContent.trim());
    });
  }

  // Get all tab panels in order
  const tabPanels = Array.from(
    tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]')
  );

  // For each panel, get its content, referencing existing elements
  const tabContents = tabPanels.map(panel => {
    const article = panel.querySelector('article');
    if (article) {
      return article;
    }
    // fallback: return all visible children
    return Array.from(panel.childNodes).filter(node => {
      if (node.nodeType === 3) {
        return node.textContent.trim().length > 0;
      } else if (node.nodeType === 1) {
        return node.textContent.trim().length > 0;
      }
      return false;
    });
  });

  // Compose the table data in the correct structure
  // 1. Header row: block name, single column
  // 2. Tab labels as second row (multiple columns)
  // 3. Tab content as third row (multiple columns, each cell = tab content)
  const tableRows = [
    ['Tabs (tabs13)'],
    tabLabels,
    tabContents
  ];

  // Create the block table and replace the original element
  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
