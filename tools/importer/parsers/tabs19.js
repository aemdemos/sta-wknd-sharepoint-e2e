/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs container
  const tabsContainer = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  if (!tabsContainer) return;

  // Find the cmp-tabs inside the tabs container
  const cmpTabs = tabsContainer.querySelector('.cmp-tabs') || tabsContainer;
  if (!cmpTabs) return;

  // Get tab labels from the tablist
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  const tabLabels = Array.from(tabList ? tabList.querySelectorAll('[role="tab"]') : []);

  // Get tab panels (content for each tab)
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[role="tabpanel"]'));

  // Defensive: ensure tabLabels and tabPanels are matched
  if (tabLabels.length === 0 || tabPanels.length === 0) return;

  // Table header row (block name)
  const headerRow = ['Tabs (tabs19)'];
  const rows = [headerRow];

  // For each tab, add a row: [label, content]
  tabLabels.forEach((tab, i) => {
    // Tab label text
    const label = tab.textContent.trim();

    // Tab content panel
    const panel = tabPanels[i];
    if (!panel) return;

    // Defensive: get the main content inside the tabpanel
    // Usually a .contentfragment or similar
    let tabContent = null;
    const cf = panel.querySelector('.contentfragment, .cmp-contentfragment');
    if (cf) {
      tabContent = cf;
    } else {
      // Fallback: use all children of the panel
      tabContent = document.createElement('div');
      Array.from(panel.childNodes).forEach((node) => {
        tabContent.appendChild(node.cloneNode(true));
      });
    }

    rows.push([label, tabContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs container with the block table
  tabsContainer.replaceWith(block);
}
