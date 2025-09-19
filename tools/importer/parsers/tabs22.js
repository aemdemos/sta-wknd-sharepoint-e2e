/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root
  const tabsRoot = element.querySelector('.tabs.panelcontainer');
  if (!tabsRoot) return;

  // Find the cmp-tabs element
  const cmpTabs = tabsRoot.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get all tab labels from the tablist
  const tabLabels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tablist .cmp-tabs__tab'));

  // Get all tab panels (content)
  const tabPanels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tabpanel'));

  // Defensive: Only proceed if counts match
  if (tabLabels.length !== tabPanels.length) return;

  // Always use the required header row
  const headerRow = ['Tabs (tabs22)'];
  const rows = [headerRow];

  // For each tab, create a row: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];

    // Defensive: Find the main content inside the tab panel
    // Usually a .contentfragment > article
    let tabContent = null;
    const article = panel.querySelector('article');
    if (article) {
      // Remove the title (h3) if present, to avoid duplicate tab label in content
      const h3 = article.querySelector('h3.cmp-contentfragment__title');
      if (h3) h3.remove();
      tabContent = article;
    } else {
      // fallback: use the panel itself
      tabContent = panel;
    }

    rows.push([label, tabContent]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block with the table
  tabsRoot.replaceWith(table);
}
