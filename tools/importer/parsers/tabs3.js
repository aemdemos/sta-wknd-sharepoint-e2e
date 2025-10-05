/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsContainer = element.querySelector('.tabs.panelcontainer');
  if (!tabsContainer) return;

  // Find the cmp-tabs element
  const cmpTabs = tabsContainer.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  const tabLabels = [];
  if (tabList) {
    tabList.querySelectorAll('li[role="tab"]').forEach(li => {
      tabLabels.push(li.textContent.trim());
    });
  }

  // Get tab panels (content)
  const tabPanels = cmpTabs.querySelectorAll('.cmp-tabs__tabpanel');
  const rows = [];

  // Header row as specified
  const headerRow = ['Tabs (tabs3)'];
  rows.push(headerRow);

  // For each tab, add a row: [label, content]
  tabPanels.forEach((panel, i) => {
    // Defensive: Use tab label if available, else fallback
    const label = tabLabels[i] || `Tab ${i+1}`;
    // The content is the entire tabpanel's content
    // We'll extract the main contentfragment/article inside each panel
    let tabContent = null;
    const cf = panel.querySelector('.cmp-contentfragment');
    if (cf) {
      tabContent = cf;
    } else {
      // fallback: use panel itself
      tabContent = panel;
    }
    rows.push([label, tabContent]);
  });

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabs block with the new table
  tabsContainer.replaceWith(block);
}
