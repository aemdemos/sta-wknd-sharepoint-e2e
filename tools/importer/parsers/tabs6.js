/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the tabs block
  const tabsBlock = element.querySelector('.tabs.panelcontainer');
  if (!tabsBlock) return;

  // Find the cmp-tabs container
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

  // Get all tab panels
  const tabPanels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tabpanel'));

  // Build table rows
  const rows = [];
  // Header row
  const headerRow = ['Tabs (tabs6)'];
  rows.push(headerRow);

  // Each tab: [label, content]
  tabPanels.forEach((panel, idx) => {
    // Defensive: Get label
    const label = tabLabels[idx] || `Tab ${idx+1}`;
    // Defensive: Get all content inside panel
    // We'll use the contentfragment/article as the main content block if present
    let content = null;
    const contentFragment = panel.querySelector('.contentfragment');
    if (contentFragment) {
      // Use the contentfragment/article as the tab content
      content = contentFragment;
    } else {
      // Fallback: use all children of panel
      content = document.createElement('div');
      Array.from(panel.childNodes).forEach(child => {
        content.append(child);
      });
    }
    rows.push([label, content]);
  });

  // Create table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace original tabs block with table
  tabsBlock.replaceWith(table);
}
