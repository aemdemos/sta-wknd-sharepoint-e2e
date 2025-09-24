/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs container (the block to convert)
  const tabsContainer = element.querySelector('.tabs .cmp-tabs');
  if (!tabsContainer) return;

  // Get tab labels from the tablist
  const tabLabels = [];
  const tabList = tabsContainer.querySelector('.cmp-tabs__tablist');
  if (tabList) {
    tabList.querySelectorAll('li[role="tab"]').forEach(li => {
      tabLabels.push(li.textContent.trim());
    });
  }

  // Get tab panels (content for each tab)
  const tabPanels = [];
  tabsContainer.querySelectorAll('.cmp-tabs__tabpanel').forEach(panel => {
    // Defensive: find the main contentfragment/article inside panel
    let content = panel.querySelector('article');
    if (!content) {
      // fallback: use the panel itself
      content = panel;
    }
    tabPanels.push(content);
  });

  // Build the table rows
  const headerRow = ['Tabs (tabs33)'];
  const rows = [headerRow];

  // Each tab: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i] || '';
    const content = tabPanels[i] || document.createElement('div');
    rows.push([label, content]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original tabs container with the block
  tabsContainer.replaceWith(block);
}
