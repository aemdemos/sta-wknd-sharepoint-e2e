/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs container
  const tabsContainer = element.querySelector('.tabs');
  if (!tabsContainer) return;

  // Find the cmp-tabs element
  const cmpTabs = tabsContainer.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels from the tablist
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  const tabLabels = [];
  if (tabList) {
    tabList.querySelectorAll('li[role="tab"]').forEach(tab => {
      tabLabels.push(tab.textContent.trim());
    });
  }

  // Get tab panels (tab content)
  const tabPanels = cmpTabs.querySelectorAll('.cmp-tabs__tabpanel');

  // Build table rows
  const rows = [];
  // Header row
  const headerRow = ['Tabs (tabs17)'];
  rows.push(headerRow);

  // Defensive: ensure tabLabels and tabPanels match
  for (let i = 0; i < tabLabels.length && i < tabPanels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    // For tab content, grab the main contentfragment/article inside the panel
    let tabContent = null;
    const contentFragment = panel.querySelector('article.cmp-contentfragment');
    if (contentFragment) {
      tabContent = contentFragment;
    } else {
      // fallback: use panel itself
      tabContent = panel;
    }
    rows.push([label, tabContent]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabs container with the block table
  tabsContainer.replaceWith(block);
}
