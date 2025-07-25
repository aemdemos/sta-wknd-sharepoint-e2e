/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block element. It has class 'cmp-tabs'.
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get tab labels from the <ol> list:
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  const tabLabels = [];
  if (tabList) {
    tabList.querySelectorAll('li[role="tab"]').forEach(li => {
      tabLabels.push(li.textContent.trim());
    });
  }

  // Get tab panel elements (content):
  const tabPanels = Array.from(tabs.querySelectorAll('[role="tabpanel"]'));
  if (tabPanels.length === 0 || tabLabels.length === 0) return;

  // Build the cells for the block table:
  const headerRow = ['Tabs (tabs10)'];
  const cells = [headerRow];

  // For each tab, add a row with [label, content]
  tabLabels.forEach((label, i) => {
    const panel = tabPanels[i];
    if (!panel) return;

    // Find the main content container in the panel, prefer article, fallback to first element child, fallback to self
    let contentElem = panel.querySelector('article, .contentfragment, .cmp-contentfragment, .cmp-contentfragment__elements');
    if (!contentElem) {
      contentElem = panel.firstElementChild;
    }
    if (!contentElem) contentElem = panel;

    cells.push([label, contentElem]);
  });

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original tabs element with the new table
  tabs.replaceWith(table);
}
