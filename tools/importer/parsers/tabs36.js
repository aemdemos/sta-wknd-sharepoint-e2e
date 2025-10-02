/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs container in the source
  const tabsContainer = element.querySelector('.tabs.panelcontainer');
  if (!tabsContainer) return;

  // Find the actual tabs component inside the tabs container
  const cmpTabs = tabsContainer.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels from tablist (ol > li)
  const tabLabels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tablist > li')).map(li => li.textContent.trim());

  // Get tab panels (content for each tab)
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Only process if labels and panels match
  if (tabLabels.length !== tabPanels.length) return;

  // Table header row: must match target block name exactly
  const headerRow = ['Tabs (tabs36)'];

  // Each row: [Tab Label, Tab Content]
  const rows = tabLabels.map((label, i) => {
    const panel = tabPanels[i];
    // Extract the main contentfragment/article inside each panel, or fallback to panel
    let tabContent = panel.querySelector('article.cmp-contentfragment') || panel;
    // Clone the node to avoid removing it from the DOM before replaceWith
    tabContent = tabContent.cloneNode(true);
    return [label, tabContent];
  });

  // Compose the table data
  const cells = [headerRow, ...rows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the tabsContainer's parent (the .tabs.panelcontainer) with the block table
  tabsContainer.replaceWith(block);
}
