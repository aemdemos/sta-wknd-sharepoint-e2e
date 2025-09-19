/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root
  const tabsRoot = element.querySelector('.tabs.panelcontainer');
  if (!tabsRoot) return;

  // Find the cmp-tabs element
  const cmpTabs = tabsRoot.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels from the tablist
  const tabLabels = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab')
  ).map(li => li.textContent.trim());

  // Get tab panels (order matches tab labels)
  const tabPanels = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Defensive: ensure labels and panels match
  if (tabLabels.length !== tabPanels.length) return;

  // Build the table rows
  const rows = [];
  // Header row per requirements
  rows.push(['Tabs (tabs29)']);

  // For each tab, add a row: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    // Defensive: clone the content to avoid moving it out of the DOM
    const contentFragment = document.createElement('div');
    // Find the main contentfragment inside the tabpanel
    const cf = panel.querySelector('.contentfragment');
    if (cf) {
      // Only include the inner content, not the outer wrapper
      Array.from(cf.childNodes).forEach(node => {
        contentFragment.appendChild(node.cloneNode(true));
      });
    } else {
      // fallback: use panel's children
      Array.from(panel.childNodes).forEach(node => {
        contentFragment.appendChild(node.cloneNode(true));
      });
    }
    rows.push([label, contentFragment]);
  }

  // Create the table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabsRoot with the new table
  tabsRoot.replaceWith(table);
}
