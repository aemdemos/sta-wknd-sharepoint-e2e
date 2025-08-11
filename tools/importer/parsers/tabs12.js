/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs container in the given element
  const tabsContainer = element.querySelector('.cmp-tabs');
  if (!tabsContainer) return;

  // Find the tab list and tab labels (li[role=tab] inside ol[role=tablist])
  const tabList = tabsContainer.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabelEls = Array.from(tabList.querySelectorAll('[role="tab"]'));

  // Find all tab panels (div[data-cmp-hook-tabs=tabpanel])
  const tabPanelEls = Array.from(
    tabsContainer.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]')
  );

  // Defensive: if the number of labels != number of panels, bail
  if (tabLabelEls.length !== tabPanelEls.length) return;

  // Header row matches the block name exactly per example
  const headerRow = ['Tabs (tabs12)'];

  // Build all tab rows: each row = [tab label, tab content]
  const rows = tabLabelEls.map((tabLabelEl, idx) => {
    // Tab label: create <strong> with label text
    const strong = document.createElement('strong');
    strong.textContent = tabLabelEl.textContent.trim();
    // Tab content: reference the main content inside the tab panel
    const tabPanel = tabPanelEls[idx];
    // try to find the first .contentfragment, fallback to the panel itself
    let contentElement = tabPanel.querySelector('.contentfragment, article, .cmp-contentfragment');
    if (!contentElement) contentElement = tabPanel;
    return [strong, contentElement];
  });

  // Compose the full table array
  const tableArr = [headerRow, ...rows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableArr, document);

  // Replace the original tabs container with the block table
  tabsContainer.replaceWith(block);
}
