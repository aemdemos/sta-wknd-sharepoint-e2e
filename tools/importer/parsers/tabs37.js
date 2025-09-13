/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the tabs container
  const tabsContainer = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  if (!tabsContainer) return;

  // Find the cmp-tabs element (may be nested)
  const cmpTabs = tabsContainer.querySelector('.cmp-tabs') || tabsContainer;
  if (!cmpTabs) return;

  // Get all tab labels (li elements)
  const tabLabels = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tablist > li')
  );

  // Get all tab panels (div[role=tabpanel])
  const tabPanels = Array.from(
    cmpTabs.querySelectorAll('[role="tabpanel"]')
  );

  // Defensive: ensure tabLabels and tabPanels match
  if (tabLabels.length !== tabPanels.length || tabLabels.length === 0) return;

  // Table header
  const headerRow = ['Tabs (tabs37)'];
  const rows = [headerRow];

  // For each tab, add a row: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];

    // Defensive: get the main content inside the tab panel
    // Usually a .contentfragment or direct children
    let tabContent = null;
    const contentFragment = panel.querySelector('.contentfragment, article.cmp-contentfragment');
    if (contentFragment) {
      tabContent = contentFragment;
    } else {
      // fallback: use all children
      tabContent = document.createElement('div');
      Array.from(panel.childNodes).forEach(node => {
        tabContent.appendChild(node.cloneNode(true));
      });
    }

    rows.push([label, tabContent]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs container with the block
  tabsContainer.replaceWith(block);
}
