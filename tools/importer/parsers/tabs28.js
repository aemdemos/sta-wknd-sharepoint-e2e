/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the tabs block based on class
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get all tab labels from the tablist
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('li')).map(li => li.textContent.trim());

  // Get all tabpanels (always in order, matching tabLabels)
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Compose header row (block name only, per spec)
  const headerRow = ['Tabs (tabs28)'];

  // Edge case: if labels/panels mismatch, handle gracefully
  const tabCount = Math.min(tabLabels.length, tabPanels.length);

  // Compose content rows: each [tab label, content] pair
  const tableRows = [];
  for (let i = 0; i < tabCount; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    // Find primary contentfragment for the tab content
    const contentFragment = panel.querySelector('.contentfragment') || panel;
    // Find .cmp-contentfragment__elements for main content
    let contentElements = contentFragment.querySelector('.cmp-contentfragment__elements');
    let contentArr = [];
    if (contentElements) {
      // Select all direct children except empty grids or whitespace
      contentArr = Array.from(contentElements.childNodes).filter(node => {
        // Remove empty AEM grids and blank text
        if (node.nodeType === 1 && node.classList && node.classList.contains('aem-Grid')) return false;
        if (node.nodeType === 3 && !node.textContent.trim()) return false;
        return true;
      });
    } else {
      // fallback: use all children of panel except empty grids/whitespace
      contentArr = Array.from(panel.childNodes).filter(node => {
        if (node.nodeType === 1 && node.classList && node.classList.contains('aem-Grid')) return false;
        if (node.nodeType === 3 && !node.textContent.trim()) return false;
        return true;
      });
    }
    // Remove any unnecessary wrappers, flatten single item
    const tabContent = contentArr.length === 1 ? contentArr[0] : contentArr;
    tableRows.push([label, tabContent]);
  }

  // Compose final cells array: header then each tab row
  const cells = [headerRow, ...tableRows];

  // Create and replace table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  tabsBlock.parentNode.replaceChild(table, tabsBlock);
}
