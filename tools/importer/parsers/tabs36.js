/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get tab label and content from cmp-tabs block
  function getTabsData(tabsEl) {
    const tabsData = [];
    // Get tab labels
    const tabLabels = Array.from(tabsEl.querySelectorAll('.cmp-tabs__tablist > li'));
    // Get tab panels
    const tabPanels = Array.from(tabsEl.querySelectorAll('.cmp-tabs__tabpanel'));
    // Defensive: Only match panels with labels
    for (let i = 0; i < tabLabels.length; i++) {
      const label = tabLabels[i]?.textContent?.trim() || '';
      const panel = tabPanels[i];
      let content = null;
      if (panel) {
        // Find the contentfragment inside the panel
        const cf = panel.querySelector('.contentfragment');
        if (cf) {
          // Use the full contentfragment element as tab content
          content = cf;
        } else {
          // If not found, use the panel itself
          content = panel;
        }
      } else {
        content = document.createTextNode('');
      }
      tabsData.push([label, content]);
    }
    return tabsData;
  }

  // Find the tabs block in the source element
  const tabsContainer = element.querySelector('.tabs.panelcontainer');
  if (!tabsContainer) return;
  const cmpTabs = tabsContainer.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Build table rows
  const headerRow = ['Tabs (tabs36)'];
  const rows = [headerRow];
  const tabsRows = getTabsData(cmpTabs);
  rows.push(...tabsRows);

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
