/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs container
  const tabsContainer = element.querySelector('.cmp-tabs');
  if (!tabsContainer) return;

  // Get tab labels
  const tablist = tabsContainer.querySelector('.cmp-tabs__tablist');
  if (!tablist) return;
  const tabLabelEls = Array.from(tablist.querySelectorAll('[role="tab"]'));

  // Get tab panels
  const tabPanelEls = Array.from(tabsContainer.querySelectorAll('.cmp-tabs__tabpanel'));
  const tabCount = Math.min(tabLabelEls.length, tabPanelEls.length);
  if (tabCount === 0) return;

  // Header row must be exactly as in the example
  const cells = [['Tabs (tabs23)']];

  // For each tab, create a row: [label, content]
  for (let i = 0; i < tabCount; i++) {
    const labelSpan = document.createElement('span');
    labelSpan.textContent = tabLabelEls[i].textContent.trim();
    // For content, use the contentfragment/article inside the tab panel if available
    let content = tabPanelEls[i].querySelector('article') || tabPanelEls[i];
    cells.push([labelSpan, content]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the entire tabs block (the .tabs.panelcontainer element)
  const outerTabs = tabsContainer.closest('.tabs.panelcontainer');
  if (outerTabs) {
    outerTabs.replaceWith(table);
  } else {
    tabsContainer.replaceWith(table);
  }
}
