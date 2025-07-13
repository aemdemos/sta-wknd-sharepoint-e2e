/* global WebImporter */
export default function parse(element, { document }) {
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get tab labels
  const tabLabelEls = Array.from(
    tabs.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab')
  );
  const tabLabels = tabLabelEls.map(tab => tab.textContent.trim());

  // Get all tab panels (the tab content), in order
  const tabPanels = Array.from(
    tabs.querySelectorAll('.cmp-tabs__tabpanel[data-cmp-hook-tabs="tabpanel"]')
  );

  const numTabs = Math.min(tabLabels.length, tabPanels.length);
  const headerRow = ['Tabs (tabs18)']; // Only one cell for header row
  const tabsHeaderRow = tabLabels.slice(0, numTabs);
  const contentRow = tabPanels.slice(0, numTabs).map(panel => {
    const cf = panel.querySelector('.contentfragment');
    return cf || panel;
  });

  const cells = [
    headerRow,
    tabsHeaderRow,
    contentRow
  ];

  // Create the table
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Fix the header row to span all columns (colspan)
  // Find the first row (header row)
  const thead = table.querySelector('tr');
  if (thead && thead.firstElementChild && numTabs > 1) {
    thead.firstElementChild.setAttribute('colspan', numTabs);
    // Remove any additional header cells that might have been created
    while (thead.children.length > 1) {
      thead.removeChild(thead.lastElementChild);
    }
  }

  // Replace the tabs block with the new table
  tabs.replaceWith(table);
}
