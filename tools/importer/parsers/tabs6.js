/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the tabs block root
  const tabsRoot = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  if (!tabsRoot) return;

  // Find the cmp-tabs element
  const cmpTabs = tabsRoot.querySelector('.cmp-tabs') || tabsRoot;
  if (!cmpTabs) return;

  // Get tab labels from the tablist
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('li[role="tab"]'));

  // Get tab panels (order matters, must match tabLabels)
  const tabPanels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tabpanel'));

  // Defensive: only keep as many panels as we have labels
  const tabCount = Math.min(tabLabels.length, tabPanels.length);

  // Prepare the table rows
  const headerRow = ['Tabs (tabs6)'];
  const rows = [headerRow];

  for (let i = 0; i < tabCount; i++) {
    const label = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];

    // Defensive: find the main content inside the tab panel
    // Usually a .contentfragment or .cmp-contentfragment, but fallback to panel children
    let tabContent = null;
    tabContent = panel.querySelector('.cmp-contentfragment, .contentfragment');
    if (!tabContent) {
      // fallback: use all children of the panel
      tabContent = document.createElement('div');
      Array.from(panel.childNodes).forEach((n) => tabContent.appendChild(n.cloneNode(true)));
    }

    rows.push([label, tabContent]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original tabs block root with the new table
  tabsRoot.replaceWith(block);
}
