/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsContainer = element.querySelector('.tabs.panelcontainer');
  if (!tabsContainer) return;

  // Find the actual tabs component
  const cmpTabs = tabsContainer.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  const tabLabels = Array.from(tabList ? tabList.querySelectorAll('.cmp-tabs__tab') : []);

  // Get tab panels (content)
  const tabPanels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tabpanel'));

  // Defensive: Only proceed if we have matching labels and panels
  if (tabLabels.length === 0 || tabPanels.length === 0) return;

  // Header row
  const headerRow = ['Tabs (tabs3)'];

  // Compose rows: each row is [Tab Label, Tab Content]
  const rows = tabLabels.map((label, i) => {
    // Tab label text
    const tabName = label.textContent.trim();
    // Tab content: find the corresponding tabpanel
    const panel = tabPanels[i];
    let tabContent = null;
    if (panel) {
      // Defensive: find the contentfragment/article inside the panel
      const contentFragment = panel.querySelector('article.cmp-contentfragment');
      if (contentFragment) {
        tabContent = contentFragment;
      } else {
        // If not found, use the panel itself
        tabContent = panel;
      }
    } else {
      tabContent = document.createElement('div');
    }
    return [tabName, tabContent];
  });

  // Build the table
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the tabsContainer with the table
  tabsContainer.replaceWith(table);
}
