/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root
  const tabsContainer = element.querySelector('.tabs.panelcontainer');
  if (!tabsContainer) return;

  // Find the actual tabs component
  const cmpTabs = tabsContainer.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get all tab labels
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('.cmp-tabs__tab'));

  // Get all tab panels (content)
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[role="tabpanel"]'));

  // Defensive: ensure labels and panels match
  if (tabLabels.length !== tabPanels.length) return;

  // Build table rows
  const rows = [];
  // Header row as per block requirements
  const headerRow = ['Tabs (tabs22)'];
  rows.push(headerRow);

  // For each tab, add a row: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    // Get the label text
    const label = tabLabels[i].textContent.trim();

    // Get the content element for the tab
    const panel = tabPanels[i];
    // Defensive: reference the actual content, not clone
    // Find the main content inside the tabpanel
    let contentElem = null;
    // Try to find a contentfragment/article or just use the panel
    const article = panel.querySelector('article');
    if (article) {
      contentElem = article;
    } else {
      // fallback: use the panel itself
      contentElem = panel;
    }

    rows.push([
      label,
      contentElem
    ]);
  }

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original tabsContainer with the table
  tabsContainer.replaceWith(table);
}
