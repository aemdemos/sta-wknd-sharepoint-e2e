/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root
  const tabsRoot = element.querySelector('.tabs.panelcontainer');
  if (!tabsRoot) return;

  // Find the cmp-tabs element
  const cmpTabs = tabsRoot.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels from the tablist
  const tabLabels = [];
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  if (tabList) {
    tabList.querySelectorAll('.cmp-tabs__tab').forEach(tab => {
      tabLabels.push(tab.textContent.trim());
    });
  }

  // Get tab panels (content)
  const tabPanels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tabpanel'));

  // Build rows: header, then one row per tab
  const headerRow = ['Tabs (tabs22)'];
  const rows = [headerRow];

  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    if (!panel) continue;

    // Find the main content inside the tab panel
    // Defensive: grab the first .contentfragment or all children if not found
    let contentEl = panel.querySelector('.contentfragment');
    let tabContent;
    if (contentEl) {
      // Use the .contentfragment as the content
      tabContent = contentEl;
    } else {
      // Fallback: use all children of the panel
      tabContent = Array.from(panel.childNodes);
    }

    rows.push([label, tabContent]);
  }

  // Create the table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block with the new table
  tabsRoot.replaceWith(table);
}
