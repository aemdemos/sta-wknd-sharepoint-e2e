/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs container
  const tabsContainer = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  let cmpTabs;
  if (tabsContainer) {
    cmpTabs = tabsContainer.querySelector('.cmp-tabs') || tabsContainer;
  } else {
    cmpTabs = element.querySelector('.cmp-tabs');
  }
  if (!cmpTabs) return;

  // Get tab labels
  const tabLabels = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab')
  ).map(tab => tab.textContent.trim());

  // Get tab panels (content)
  const tabPanels = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Defensive: If no labels or panels, abort
  if (!tabLabels.length || !tabPanels.length) return;

  // Build rows: first row is always the block name
  const rows = [['Tabs (tabs12)']];

  // For each tab, add a row: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    if (!panel) continue;

    // Only include the content inside the tab panel (do NOT include sidebar)
    let tabContent = null;
    // Usually the content is inside a .contentfragment or direct children
    const cf = panel.querySelector('.contentfragment, article.cmp-contentfragment');
    if (cf) {
      tabContent = cf.cloneNode(true);
    } else {
      tabContent = document.createElement('div');
      Array.from(panel.childNodes).forEach(node => tabContent.appendChild(node.cloneNode(true)));
    }
    rows.push([label, tabContent]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the entire element with the block table
  element.replaceWith(block);
}
