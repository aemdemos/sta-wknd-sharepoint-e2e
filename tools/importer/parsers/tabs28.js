/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs container
  const tabsContainer = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  let cmpTabs = tabsContainer;
  if (!cmpTabs || !cmpTabs.classList.contains('cmp-tabs')) {
    cmpTabs = tabsContainer && tabsContainer.querySelector('.cmp-tabs');
  }
  if (!cmpTabs) return;

  // Get tab labels from tablist
  const tabLabels = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tablist > li[role="tab"]')
  );

  // Get tab panels (content)
  const tabPanels = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Defensive: ensure we have matching labels and panels
  if (!tabLabels.length || !tabPanels.length) return;

  // Build rows for table
  const rows = [];
  // Header row
  rows.push(['Tabs (tabs28)']);

  // For each tab, add a row: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    // Defensive: match tab panel by order
    const panel = tabPanels[i];
    // Defensive: if panel missing, skip
    if (!panel) continue;
    // For content, use the whole panel element (preserves structure, images, etc)
    rows.push([label, panel]);
  }

  // Create table block
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs element with the block
  tabsContainer.replaceWith(block);
}
