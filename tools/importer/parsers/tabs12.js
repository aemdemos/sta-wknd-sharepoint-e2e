/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block within the element
  const tabsBlock = element.querySelector('.tabs.panelcontainer');
  if (!tabsBlock) return;

  // Get the cmp-tabs container
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels from the tablist
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  const tabLabels = [];
  if (tabList) {
    tabList.querySelectorAll('li[role="tab"]').forEach(li => {
      tabLabels.push(li.textContent.trim());
    });
  }

  // Get tab panels (content)
  const tabPanels = [];
  cmpTabs.querySelectorAll('.cmp-tabs__tabpanel').forEach(panel => {
    // Defensive: Only include visible panels or all panels?
    // We'll include all panels, as each tab should be a row.
    // Find the contentfragment/article inside each panel
    const article = panel.querySelector('article');
    if (article) {
      tabPanels.push(article);
    } else {
      // fallback: use the panel itself
      tabPanels.push(panel);
    }
  });

  // Compose the table rows
  const headerRow = ['Tabs (tabs12)'];
  const rows = [headerRow];

  // Each tab: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const content = tabPanels[i] || '';
    rows.push([label, content]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabs block with the new table
  tabsBlock.replaceWith(block);
}
