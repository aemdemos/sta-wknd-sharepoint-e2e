/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block container
  const tabsContainer = element.querySelector('.tabs.panelcontainer');
  if (!tabsContainer) return;

  // Find the actual tabs component
  const cmpTabs = tabsContainer.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels from tablist
  const tabLabels = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tablist > li[role="tab"]')
  ).map(tab => tab.textContent.trim());

  // Get tab panels (content)
  const tabPanels = Array.from(
    cmpTabs.querySelectorAll('[role="tabpanel"]')
  );

  // Defensive: Only proceed if we have matching labels and panels
  if (tabLabels.length !== tabPanels.length || tabLabels.length === 0) return;

  // Build rows for the block table
  const rows = [];
  // Header row: block name
  rows.push(['Tabs (tabs23)']);

  // For each tab, add a row: [Tab Label, Tab Content]
  tabLabels.forEach((label, idx) => {
    const panel = tabPanels[idx];
    // Defensive: If panel is missing, skip
    if (!panel) return;

    // For content, grab everything inside the tabpanel
    // We want the actual content fragment/article inside each tabpanel
    // Usually the content is inside a .contentfragment > article
    let tabContent = null;
    const contentFragment = panel.querySelector('.contentfragment');
    if (contentFragment) {
      // Use the whole contentfragment as the tab content
      tabContent = contentFragment;
    } else {
      // Fallback: use all children of the panel
      tabContent = document.createElement('div');
      Array.from(panel.childNodes).forEach(child => {
        tabContent.appendChild(child.cloneNode(true));
      });
    }
    rows.push([label, tabContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block with the new block table
  tabsContainer.replaceWith(block);
}
