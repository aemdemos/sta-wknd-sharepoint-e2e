/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the tabs block root
  const tabsRoot = element.closest('.tabs.panelcontainer') || element;
  // Find the cmp-tabs element
  const cmpTabs = tabsRoot.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels from the tablist
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  const tabLabels = [];
  if (tabList) {
    tabList.querySelectorAll('li[role="tab"]').forEach(tab => {
      tabLabels.push(tab.textContent.trim());
    });
  }

  // Get tab panels (content)
  const tabPanels = cmpTabs.querySelectorAll('.cmp-tabs__tabpanel');

  // Build rows: [label, content]
  const rows = [];
  tabPanels.forEach((panel, idx) => {
    // Defensive: Find the tab label
    const label = tabLabels[idx] || `Tab ${idx + 1}`;
    // Defensive: Find the main contentfragment/article inside each panel
    let tabContent = null;
    const contentFragment = panel.querySelector('article.cmp-contentfragment') || panel.querySelector('.contentfragment');
    if (contentFragment) {
      tabContent = contentFragment;
    } else {
      // fallback: use panel itself
      tabContent = panel;
    }
    rows.push([label, tabContent]);
  });

  // Table header row
  const headerRow = ['Tabs (tabs11)'];
  const cells = [headerRow, ...rows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the tabs block with the new table
  tabsRoot.replaceWith(block);
}
