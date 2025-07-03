/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get the tab labels from the tablist
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  const tabLabels = [];
  if (tabList) {
    tabList.querySelectorAll('[role="tab"]').forEach((tab) => {
      tabLabels.push(tab.textContent.trim());
    });
  }

  // Get the tab panels (in order)
  const tabPanels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tabpanel'));

  // Compose the table header
  const headerRow = ['Tabs (tabs12)'];

  // Compose the rows with [Tab Label, Tab Content]
  const rows = [];
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    if (!label || !panel) continue;
    
    // Compose the content for the tab
    // Grab all direct children of panel that are not script/style
    // Usually there's one big contentfragment > article per tab
    let tabContentElem = null;
    const contentFragmentDiv = panel.querySelector('.contentfragment');
    if (contentFragmentDiv) {
      // Use the entire article if present
      const article = contentFragmentDiv.querySelector('article');
      if (article) {
        tabContentElem = article;
      } else {
        tabContentElem = contentFragmentDiv;
      }
    } else {
      // fallback to panel inner content
      tabContentElem = panel;
    }
    rows.push([label, tabContentElem]);
  }

  // Compose the final cells array
  const cells = [headerRow, ...rows];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original tabs block with the new table
  tabsBlock.replaceWith(table);
}
