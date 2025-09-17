/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the tabs container (could be .tabs or .panelcontainer)
  const tabsContainer = element.closest('.tabs.panelcontainer') || element;
  // Find the cmp-tabs element inside
  const cmpTabs = tabsContainer.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels from the tablist
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  const tabLabels = Array.from(tabList ? tabList.children : []).map(tab => tab.textContent.trim());

  // Get all tab panels (content)
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Defensive: Only proceed if we have matching labels and panels
  if (tabLabels.length === 0 || tabPanels.length === 0) return;

  // Build rows: Each row is [Tab Label, Tab Content]
  const rows = tabLabels.map((label, i) => {
    // Defensive: Some tabs may be hidden, but we want all
    const panel = tabPanels[i];
    let tabContent = null;
    if (panel) {
      // Defensive: Use the entire contentfragment/article as the tab content
      const contentFragment = panel.querySelector('.contentfragment') || panel;
      tabContent = contentFragment;
    } else {
      tabContent = document.createTextNode('');
    }
    return [label, tabContent];
  });

  // Table header row as required
  const headerRow = ['Tabs (tabs15)'];

  // Final table data
  const cells = [headerRow, ...rows];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  tabsContainer.replaceWith(block);
}
