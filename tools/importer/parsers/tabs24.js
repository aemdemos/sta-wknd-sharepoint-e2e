/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root
  const tabsContainer = element.querySelector('.tabs.panelcontainer');
  if (!tabsContainer) return;

  // Find the cmp-tabs element
  const cmpTabs = tabsContainer.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels (li elements inside ol[role=tablist])
  const tabList = cmpTabs.querySelector('ol[role="tablist"]');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('li'));

  // Get tab panels (div[role=tabpanel])
  const tabPanels = Array.from(cmpTabs.querySelectorAll('div[role="tabpanel"]'));

  // Defensive: only process if we have matching number of labels and panels
  if (tabLabels.length !== tabPanels.length) return;

  // Prepare table rows
  const headerRow = ['Tabs (tabs24)'];
  const rows = [headerRow];

  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];

    // For tab content, extract the main content fragment/article inside the tabpanel
    let tabContent = null;
    // Find the article or direct contentfragment inside the panel
    tabContent = panel.querySelector('article') || panel.querySelector('.contentfragment');
    // If not found, fallback to all children
    if (!tabContent) {
      // Defensive: create a div with all children
      const div = document.createElement('div');
      Array.from(panel.childNodes).forEach(node => div.appendChild(node.cloneNode(true)));
      tabContent = div;
    }
    rows.push([label, tabContent]);
  }

  // Create the table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original tabs block with the table
  tabsContainer.replaceWith(table);
}
