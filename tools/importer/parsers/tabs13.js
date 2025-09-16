/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the tabs block root
  const tabsRoot = element.closest('.tabs.panelcontainer') || element;
  // Find the cmp-tabs element
  const cmpTabs = tabsRoot.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels from the tablist
  const tabLabels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tab'));
  // Get tab panels (content)
  const tabPanels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tabpanel'));

  // Build rows: each row is [Tab Label, Tab Content]
  const rows = [];
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i]?.textContent?.trim() || '';
    // Defensive: get corresponding panel
    const panel = tabPanels[i];
    let content = null;
    if (panel) {
      // Use the entire tabpanel content for resilience
      // Defensive: find the main contentfragment/article inside panel
      const cf = panel.querySelector('article') || panel;
      content = cf;
    } else {
      // If no panel, fallback to empty div
      content = document.createElement('div');
    }
    rows.push([label, content]);
  }

  // Table header row
  const headerRow = ['Tabs (tabs13)'];
  const cells = [headerRow, ...rows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the tabs block with the new block table
  tabsRoot.replaceWith(block);
}
