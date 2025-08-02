/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block in the element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Header row for the table as required
  const headerRow = ['Tabs (tabs30)'];

  // Get all tab labels from tablist
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('li'));

  // Get all tab panels (content) in the order they appear
  const tabPanels = Array.from(tabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // If no tabs or panels, abort
  if (tabLabels.length === 0 || tabPanels.length === 0) return;

  // Compose each row: [tab label, tab content]
  const rows = tabLabels.map((tab, idx) => {
    const label = tab.textContent.trim();
    const panel = tabPanels[idx];
    let content = null;
    if (panel) {
      // Reference the entire tabpanel's content (including images, headings, etc)
      // Clean up attributes for safety
      ['aria-labelledby','tabindex','aria-hidden','data-cmp-data-layer','id','role'].forEach(attr => {
        panel.removeAttribute(attr);
      });
      // Some tabs have a single .contentfragment > article, but we want to keep all content
      // So reference the panel directly
      content = panel;
    }
    return [label, content];
  });

  // Final cells array for createTable
  const cells = [headerRow, ...rows];

  // Create the table block and replace the element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
