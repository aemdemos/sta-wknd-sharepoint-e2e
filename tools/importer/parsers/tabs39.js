/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root
  const tabsRoot = element.querySelector('.tabs.panelcontainer');
  if (!tabsRoot) return;

  // Find the cmp-tabs element (contains tab labels and tab panels)
  const cmpTabs = tabsRoot.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels (in order)
  const tabLabels = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab')
  ).map(tab => tab.textContent.trim());

  // Get tab panels (in order)
  const tabPanels = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Defensive: ensure same number of labels and panels
  if (tabLabels.length !== tabPanels.length) return;

  // Build rows: header, then one row per tab (label, content)
  const headerRow = ['Tabs (tabs39)'];
  const rows = [headerRow];

  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];

    // Defensive: reference the main content inside the panel (usually a contentfragment/article)
    let tabContent = null;
    // Try to find the main contentfragment/article
    const cf = panel.querySelector('article.cmp-contentfragment') || panel.querySelector('.contentfragment');
    if (cf) {
      tabContent = cf;
    } else {
      // fallback: use the whole panel
      tabContent = panel;
    }
    rows.push([label, tabContent]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabsRoot with the new table
  tabsRoot.replaceWith(table);
}
