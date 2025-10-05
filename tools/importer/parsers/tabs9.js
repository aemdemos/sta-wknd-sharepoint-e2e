/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get tab label and content from tabpanel
  function getTabInfo(tabPanel, tabListItems) {
    // Find the tab label by matching aria-labelledby with tab id
    const ariaLabelledBy = tabPanel.getAttribute('aria-labelledby');
    let tabLabel = '';
    if (ariaLabelledBy) {
      const tab = Array.from(tabListItems).find(
        (li) => li.id === ariaLabelledBy
      );
      if (tab) {
        tabLabel = tab.textContent.trim();
      }
    }
    // Tab content is everything inside the tabPanel
    // Defensive: if tabPanel contains a single contentfragment/article, use that
    let tabContent = null;
    const cf = tabPanel.querySelector('article.cmp-contentfragment');
    if (cf) {
      tabContent = cf;
    } else {
      // fallback: use the tabPanel itself
      tabContent = tabPanel;
    }
    return [tabLabel, tabContent];
  }

  // Find the tabs block
  const tabsContainer = element.querySelector('.tabs.panelcontainer');
  if (!tabsContainer) return;
  const cmpTabs = tabsContainer.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab list and tab panels
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  const tabListItems = tabList ? tabList.querySelectorAll('li[role="tab"]') : [];
  const tabPanels = cmpTabs.querySelectorAll('.cmp-tabs__tabpanel');

  // Compose header row
  const headerRow = ['Tabs (tabs9)'];
  const rows = [headerRow];

  // For each tab panel, add a row: [Tab Label, Tab Content]
  tabPanels.forEach((tabPanel) => {
    const [tabLabel, tabContent] = getTabInfo(tabPanel, tabListItems);
    if (tabLabel && tabContent) {
      rows.push([tabLabel, tabContent]);
    }
  });

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
