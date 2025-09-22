/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .tabs or .cmp-tabs element
  const tabsContainer = element.querySelector('.tabs, .cmp-tabs');
  if (!tabsContainer) return;

  // Header row as required
  const headerRow = ['Tabs (tabs19)'];

  // Get tab labels from tablist (li elements)
  const tabList = tabsContainer.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('li'));

  // Get tab panels (content for each tab)
  const tabPanels = Array.from(tabsContainer.querySelectorAll('[role="tabpanel"]'));

  // Defensive: ensure we have same number of labels and panels
  const numTabs = Math.min(tabLabels.length, tabPanels.length);

  // Build rows: each row is [tab label, tab content]
  const rows = [];
  for (let i = 0; i < numTabs; i++) {
    // Get label text
    const label = tabLabels[i].textContent.trim();
    // Get tab panel content
    const panel = tabPanels[i];
    // Defensive: find the main content fragment/article inside the panel
    let tabContent = null;
    const cf = panel.querySelector('article.cmp-contentfragment');
    if (cf) {
      // Remove the title (h3.cmp-contentfragment__title) if present (to avoid duplicate tab label)
      const cfClone = cf.cloneNode(true);
      const cfTitle = cfClone.querySelector('.cmp-contentfragment__title');
      if (cfTitle) cfTitle.remove();
      tabContent = cfClone;
    } else {
      // fallback: use the panel's content
      tabContent = panel.cloneNode(true);
    }
    rows.push([label, tabContent]);
  }

  // Compose the table data
  const tableData = [headerRow, ...rows];

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(tableData, document);

  // Replace the tabs container with the table
  tabsContainer.replaceWith(table);
}
