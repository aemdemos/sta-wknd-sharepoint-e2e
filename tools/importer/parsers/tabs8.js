/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the tabs root
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Extract tab labels in order
  const tabLabels = Array.from(tabs.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab'));
  // Extract tab panels in order
  const tabPanels = Array.from(tabs.querySelectorAll('.cmp-tabs__tabpanel'));

  if (tabLabels.length === 0 || tabPanels.length === 0 || tabLabels.length !== tabPanels.length) {
    return;
  }

  // Build the table rows as per the markdown example:
  // 1. Header row: one cell
  // 2. Labels row: each label in its own cell
  // 3. Contents row: each tab panel's content in its own cell
  const headerRow = ['Tabs (tabs8)'];
  const labelsRow = tabLabels.map(tab => tab.textContent.trim());
  const contentsRow = tabPanels.map(panel => {
    // Try to find the contentfragment/article inside the tab panel
    let content = panel.querySelector('article.cmp-contentfragment') || panel.querySelector('.contentfragment');
    return content ? content : panel;
  });

  const cells = [headerRow, labelsRow, contentsRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
