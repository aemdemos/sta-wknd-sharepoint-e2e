/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs block in the element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Find tab labels (li elements inside tablist)
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;

  const tabRows = [];
  const tabIds = [];
  const tabLabels = [];

  tabList.querySelectorAll('li[role="tab"]').forEach((li) => {
    tabLabels.push(li.textContent.trim());
    tabIds.push(li.getAttribute('aria-controls'));
  });

  // For each tab, find the corresponding tabpanel (content)
  tabIds.forEach((tabpanelId, idx) => {
    const tabpanel = tabsBlock.querySelector(`#${tabpanelId}`);
    if (!tabpanel) {
      tabRows.push([tabLabels[idx], '']);
      return;
    }
    // Try to use article/contentfragment if present, otherwise fallback to tabpanel
    let tabContent = null;
    // If tabpanel has only one child (contentfragment), just use that
    const article = tabpanel.querySelector('article');
    if (article) {
      tabContent = article;
    } else {
      // fallback: use the tabpanel itself (should not happen, but for resilience)
      tabContent = tabpanel;
    }
    tabRows.push([tabLabels[idx], tabContent]);
  });

  // Build the block table: first row is block header, then the tab label/content rows
  const tableRows = [
    ['Tabs (tabs28)'],
    ...tabRows
  ];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  tabsBlock.replaceWith(table);
}
