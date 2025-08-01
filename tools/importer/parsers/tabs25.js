/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tab block root (the cmp-tabs inside the main container)
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get the tab labels in order
  const tablist = tabs.querySelector('.cmp-tabs__tablist');
  const tabLabels = [];
  if (tablist) {
    tablist.querySelectorAll('[role="tab"]').forEach(tab => {
      tabLabels.push(tab.textContent.trim());
    });
  }

  // Get the tab panels in order (they follow the same order as the tab labels)
  const tabPanels = tabs.querySelectorAll('[role="tabpanel"]');

  // Prepare the table rows
  // Header row according to spec
  const cells = [
    ['Tabs (tabs25)']
  ];

  // For each tab, create a row with [Tab Label, Tab Content (referenced element)]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const tabPanel = tabPanels[i];
    let contentCell;
    if (tabPanel) {
      contentCell = tabPanel;
    } else {
      // fallback to empty span if somehow missing
      contentCell = document.createElement('span');
    }
    cells.push([label, contentCell]);
  }

  // Create the tabs block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the .cmp-tabs element itself in the DOM with the block table
  tabs.replaceWith(block);
}
