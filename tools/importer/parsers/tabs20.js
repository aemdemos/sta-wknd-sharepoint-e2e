/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.tabs .cmp-tabs');
  if (!tabsBlock) return;

  // Extract tab labels and tab content panels
  const tabLabels = Array.from(
    tabsBlock.querySelectorAll('.cmp-tabs__tablist .cmp-tabs__tab')
  ).map(tab => tab.textContent.trim());
  const tabPanels = tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]');

  // Compose table rows: header first, then one row per tab (label, content)
  const cells = [['Tabs (tabs20)']];
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    let contentElem = null;
    if (panel) {
      // Use .contentfragment or article if present, else panel itself
      contentElem = panel.querySelector('.contentfragment') || panel.querySelector('article') || panel;
    } else {
      contentElem = document.createElement('div');
    }
    cells.push([label, contentElem]);
  }
  // Create table and replace tabs block with it
  const table = WebImporter.DOMUtils.createTable(cells, document);
  tabsBlock.replaceWith(table);
}
