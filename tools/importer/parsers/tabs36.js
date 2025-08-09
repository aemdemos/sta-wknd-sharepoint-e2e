/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root
  const tabsRoot = element.querySelector('.tabs .cmp-tabs');
  if (!tabsRoot) return;

  // Get all tab labels (li elements inside tablist)
  const tabList = tabsRoot.querySelector('.cmp-tabs__tablist');
  const tabLabelElements = tabList ? Array.from(tabList.querySelectorAll('li')) : [];
  // Get all tab panels (tab content containers)
  const tabPanelElements = Array.from(tabsRoot.querySelectorAll('.cmp-tabs__tabpanel'));

  // Compose the table rows
  const tableRows = [];
  // First row: Header (block name), single cell
  tableRows.push(['Tabs (tabs36)']);

  // Next rows: one row per tab [Tab Label, Tab Content]
  for (let i = 0; i < tabLabelElements.length; i++) {
    // Tab label as <strong>text</strong> (not <li>)
    const label = document.createElement('strong');
    label.textContent = tabLabelElements[i].textContent.trim();
    // Tab content: use .contentfragment if present, else panel itself
    let content = tabPanelElements[i];
    if (content) {
      const contentFragment = content.querySelector('.contentfragment');
      if (contentFragment) content = contentFragment;
      tableRows.push([label, content]);
    }
    // If no content panel, skip
  }

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  tabsRoot.replaceWith(table);
}
