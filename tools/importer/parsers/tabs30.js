/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block - must be present
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // 1. Get all tab labels in order
  const tabLabels = Array.from(
    tabsRoot.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab')
  ).map((li) => li.textContent.trim());

  // 2. Get all tab panels in source DOM order (assuming order matches labels)
  const tabPanels = Array.from(
    tabsRoot.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // 3. Prepare rows: header is a single cell, content rows are arrays with two cells
  const cells = [];
  // Header row: single cell
  cells.push(['Tabs (tabs30)']);

  // Content rows: [Tab Label, Tab Content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    if (!panel) continue;

    let tabContent = [];
    // Try to extract the tab content similarly to before
    const contentFragment = panel.querySelector('article.cmp-contentfragment');
    if (contentFragment) {
      const elementsWrapper = contentFragment.querySelector('.cmp-contentfragment__elements');
      if (elementsWrapper) {
        Array.from(elementsWrapper.querySelectorAll('.aem-Grid, .aem-GridColumn')).forEach((div) => div.remove());
        tabContent = Array.from(elementsWrapper.childNodes).filter((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.tagName === 'DIV' && node.childNodes.length === 0) return false;
            return true;
          } else if (node.nodeType === Node.TEXT_NODE) {
            return node.textContent.trim().length > 0;
          }
          return false;
        });
        if (!tabContent.length) tabContent = [elementsWrapper];
      } else {
        tabContent = [contentFragment];
      }
    } else {
      tabContent = Array.from(panel.childNodes).filter((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          if (node.tagName === 'DIV' && node.childNodes.length === 0) return false;
          return true;
        } else if (node.nodeType === Node.TEXT_NODE) {
          return node.textContent.trim().length > 0;
        }
        return false;
      });
      if (!tabContent.length) tabContent = [panel];
    }
    cells.push([label, tabContent.length === 1 ? tabContent[0] : tabContent]);
  }

  // Create the table
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Make sure header row spans both columns, if needed
  const firstRow = table.querySelector('tr');
  if (firstRow && firstRow.children.length === 1 && cells.length > 1) {
    firstRow.children[0].setAttribute('colspan', '2');
  }

  // Replace the tabsRoot with the new table
  tabsRoot.replaceWith(table);
}
