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

  // Build rows: header row, then one row per tab
  const headerRow = ['Tabs (tabs39)'];
  const rows = [headerRow];

  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    let content = null;
    if (panel) {
      // Defensive: get the main contentfragment/article inside the tabpanel
      const cf = panel.querySelector('article.cmp-contentfragment');
      if (cf) {
        // Remove the title (h3) if present, as the tab label is already in the first cell
        const cfClone = cf.cloneNode(true);
        const h3 = cfClone.querySelector('h3');
        if (h3) h3.remove();
        content = cfClone;
      } else {
        // Fallback: use the panel content directly
        content = panel.cloneNode(true);
      }
    } else {
      content = '';
    }
    rows.push([label, content]);
  }

  // Create the table and replace the element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
