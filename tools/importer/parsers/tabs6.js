/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs element inside this block
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get all tab labels in DOM order
  const tabList = tabsRoot.querySelector('.cmp-tabs__tablist');
  const tabLabels = [];
  if (tabList) {
    tabList.querySelectorAll('li[role="tab"]').forEach(tab => {
      tabLabels.push(tab.textContent.trim());
    });
  }

  // Get all tab panels (in DOM order)
  const tabPanels = Array.from(tabsRoot.querySelectorAll('[role="tabpanel"][data-cmp-hook-tabs="tabpanel"]'));

  // Build the header row (block name, as specified by requirements)
  const rows = [ ['Tabs (tabs6)'] ];

  // Each tab row: [Tab Label, Tab Content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const tabPanel = tabPanels[i];
    if (!label || !tabPanel) continue;

    // Use the contentfragment article if available, else fallback to all children
    let cellContent;
    const contentFragment = tabPanel.querySelector('article.cmp-contentfragment');
    if (contentFragment) {
      cellContent = contentFragment;
    } else {
      // fallback: all children (not clones)
      cellContent = Array.from(tabPanel.childNodes);
    }
    rows.push([label, cellContent]);
  }

  // Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.parentNode.replaceChild(table, element);
}
