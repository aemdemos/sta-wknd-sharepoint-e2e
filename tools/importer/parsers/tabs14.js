/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs container (with class 'cmp-tabs')
  const tabsContainer = element.querySelector('.cmp-tabs');
  if (!tabsContainer) return;

  // Get tab labels from the tablist (ol > li)
  const tabList = tabsContainer.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('li')).map(li => li.textContent.trim());

  // Get all tab panels (div[role=tabpanel])
  const tabPanels = Array.from(tabsContainer.querySelectorAll('[role="tabpanel"]'));
  if (tabLabels.length !== tabPanels.length) {
    // Defensive: if mismatch, bail
    return;
  }

  // Compose rows: first row is header, then each tab as [label, content]
  const rows = [];
  // Header row
  const headerRow = ['Tabs (tabs14)'];
  rows.push(headerRow);

  // For each tab, add a row: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    // Defensive: clone the content to avoid moving it from DOM
    const contentFragment = document.createElement('div');
    // Copy all children of the panel
    Array.from(panel.childNodes).forEach(child => {
      contentFragment.appendChild(child.cloneNode(true));
    });
    rows.push([label, contentFragment]);
  }

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
