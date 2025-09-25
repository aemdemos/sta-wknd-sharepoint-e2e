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
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[role="tabpanel"]'));

  // Build table rows
  const headerRow = ['Tabs (tabs19)'];
  const rows = [headerRow];

  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    if (!panel) continue;

    // Defensive: find the main content fragment inside the tab panel
    let tabContent = null;
    // Try to find the .cmp-contentfragment inside the panel
    const cf = panel.querySelector('.cmp-contentfragment');
    if (cf) {
      // Remove the h3.cmp-contentfragment__title if present (to avoid duplicate tab label)
      const cfTitle = cf.querySelector('.cmp-contentfragment__title');
      if (cfTitle) cfTitle.remove();
      tabContent = cf;
    } else {
      // Fallback: use the panel's content
      tabContent = panel;
    }
    rows.push([label, tabContent]);
  }

  // Create the table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original tabs block with the table
  tabsRoot.replaceWith(table);
}
