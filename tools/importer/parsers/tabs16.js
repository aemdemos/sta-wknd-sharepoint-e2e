/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs container
  const tabsEl = element.querySelector('.cmp-tabs');
  if (!tabsEl) return;
  
  // Find all tab labels (from list items in the tablist)
  const tabLabels = [];
  const tabList = tabsEl.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  tabList.querySelectorAll('li').forEach(li => {
    tabLabels.push(li.textContent.trim());
  });

  // Find all tab panels (order should match tab labels)
  const tabPanels = Array.from(tabsEl.querySelectorAll('.cmp-tabs__tabpanel'));
  if (tabLabels.length !== tabPanels.length) {
    return;
  }

  // Build the table rows
  const headerRow = ['Tabs (tabs16)'];
  const rows = [headerRow];

  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    // Use the actual child nodes of the panel
    // We'll collect the children into an array, referencing existing elements
    const cellContent = [];
    Array.from(panel.childNodes).forEach(child => {
      if (child.nodeType === Node.ELEMENT_NODE || (child.nodeType === Node.TEXT_NODE && child.textContent.trim().length > 0)) {
        cellContent.push(child);
      }
    });
    rows.push([label, cellContent]);
  }

  // Create the table and replace the element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  tabsEl.replaceWith(table);
}
