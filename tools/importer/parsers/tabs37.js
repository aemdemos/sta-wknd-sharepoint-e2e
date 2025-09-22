/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root
  const tabsContainer = element.querySelector('.tabs.panelcontainer');
  if (!tabsContainer) return;

  // Find the cmp-tabs element
  const cmpTabs = tabsContainer.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get the tab labels from the tablist
  const tabLabels = [];
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  if (tabList) {
    tabList.querySelectorAll('li[role="tab"]').forEach(tab => {
      tabLabels.push(tab.textContent.trim());
    });
  }

  // Get the tab panels (content)
  const tabPanels = cmpTabs.querySelectorAll('[role="tabpanel"]');

  // Compose table rows
  const headerRow = ['Tabs (tabs37)'];
  const rows = [headerRow];

  tabPanels.forEach((panel, idx) => {
    // Defensive: get the label, fallback to panel heading if missing
    let label = tabLabels[idx] || panel.getAttribute('aria-labelledby') || `Tab ${idx+1}`;

    // Find the main content fragment/article inside the panel
    let content = null;
    const article = panel.querySelector('article');
    if (article) {
      // Use the article as the content
      content = article;
    } else {
      // Fallback: use the panel's children
      content = panel;
    }
    rows.push([label, content]);
  });

  // Create the table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block with the new table
  tabsContainer.replaceWith(table);
}
