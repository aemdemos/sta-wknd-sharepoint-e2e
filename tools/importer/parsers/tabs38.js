/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs container (by class 'tabs panelcontainer')
  const tabsContainer = element.querySelector('.tabs.panelcontainer');
  if (!tabsContainer) return;

  // Find the cmp-tabs element inside
  const cmpTabs = tabsContainer.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels from the tablist (ol > li)
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('li'));

  // Get tab panels (div[role=tabpanel])
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[role="tabpanel"]'));

  // Defensive: Only process as many panels as there are labels
  const tabCount = Math.min(tabLabels.length, tabPanels.length);

  // Build rows: header, then one row per tab (label, content)
  const rows = [];
  // Header row as per requirements
  const headerRow = ['Tabs (tabs38)'];
  rows.push(headerRow);

  for (let i = 0; i < tabCount; i++) {
    // Get the label text
    const label = tabLabels[i].textContent.trim();
    // Get the tab panel content
    const panel = tabPanels[i];
    // Defensive: find the main content fragment/article inside the panel
    let tabContent = null;
    // Try to find the contentfragment/article, but fallback to panel's children
    const cf = panel.querySelector('article.cmp-contentfragment');
    if (cf) {
      tabContent = cf;
    } else {
      // fallback: use all children of panel
      tabContent = Array.from(panel.childNodes);
    }
    rows.push([label, tabContent]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original tabs container with the block table
  tabsContainer.replaceWith(block);
}
