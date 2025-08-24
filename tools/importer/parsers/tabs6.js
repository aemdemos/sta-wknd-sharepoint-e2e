/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block within the provided element
  const tabsRoot = element.querySelector('.tabs .cmp-tabs');
  if (!tabsRoot) return;

  // Extract tab labels from the tablist
  const tablist = tabsRoot.querySelector('.cmp-tabs__tablist');
  const tabLabels = [];
  if (tablist) {
    tablist.querySelectorAll('li').forEach(li => {
      tabLabels.push(li.textContent.trim());
    });
  }

  // Extract tab panels (content)
  const panels = Array.from(tabsRoot.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Check for edge case: label/panel mismatch
  // Only process as many panels as there are labels
  const panelCount = Math.min(tabLabels.length, panels.length);

  // Table: first row is the block name, second row is tab labels, following rows are each tab's content
  const tableRows = [];
  // EXACT block name from spec
  tableRows.push(['Tabs (tabs6)']);
  // Tab labels row
  tableRows.push(tabLabels);
  // Each tab content row: reference the contentfragment/article element directly if present, otherwise fallback
  for (let i = 0; i < panelCount; i++) {
    const panel = panels[i];
    // Most panels have a main <article> (contentfragment). Use it if present
    const article = panel.querySelector('article');
    if (article) {
      tableRows.push([article]);
    } else {
      // If not, reference the whole panel
      tableRows.push([panel]);
    }
  }

  // Create table
  const blockTable = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the original block element
  element.parentNode.replaceChild(blockTable, element);
}
