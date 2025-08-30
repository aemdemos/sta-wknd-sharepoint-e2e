/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cmp-tabs root inside this block
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get the tab labels (li elements inside .cmp-tabs__tablist)
  const tabList = tabsRoot.querySelector('.cmp-tabs__tablist');
  const tabItems = tabList ? Array.from(tabList.querySelectorAll('li')) : [];

  // Collect all tabpanels (the tab content)
  const tabPanels = Array.from(tabsRoot.querySelectorAll('[role="tabpanel"]'));

  // Compose header row, exactly as in the example: single cell
  const headerRow = ['Tabs (tabs21)'];
  const cells = [headerRow];

  // Each tab gets a row: [label, content]
  const numTabs = Math.min(tabItems.length, tabPanels.length);
  for (let i = 0; i < numTabs; i++) {
    const labelEl = tabItems[i];
    // For panel: extract only its meaningful children (skip empty grid wrappers)
    const panel = tabPanels[i];
    // Try to use the content inside the panel, but if empty, use the panel element
    const contentArr = [];
    for (let child of panel.children) {
      // ignore empty aem-Grid wrappers
      if (
        child.classList &&
        child.classList.contains('aem-Grid') &&
        child.childElementCount === 0
      ) continue;
      contentArr.push(child);
    }
    const content = contentArr.length > 0 ? contentArr : [panel];
    cells.push([labelEl, content]);
  }

  // Create the tabs block table and replace the original cmp-tabs element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  tabsRoot.replaceWith(table);
}
