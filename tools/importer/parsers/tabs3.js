/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block in the source HTML
  const tabsContainer = element.querySelector('.tabs');
  if (!tabsContainer) return;

  // Find the cmp-tabs element
  const cmpTabs = tabsContainer.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get all tab labels from the tablist
  const tabLabels = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tablist > li[role="tab"]')
  ).map(tab => tab.textContent.trim());

  // Get all tab panels (content)
  const tabPanels = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Defensive: Only keep as many panels as we have labels
  const numTabs = Math.min(tabLabels.length, tabPanels.length);

  // Table header row
  const headerRow = ['Tabs (tabs3)'];
  const rows = [headerRow];

  // For each tab, add a row: [label, content]
  for (let i = 0; i < numTabs; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];

    // Reference the contentfragment/article if present, else the panel itself
    let tabContent = null;
    const contentFrag = panel.querySelector('.cmp-contentfragment');
    if (contentFrag) {
      tabContent = contentFrag;
    } else {
      tabContent = panel;
    }

    rows.push([label, tabContent]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabsContainer with the block table
  tabsContainer.replaceWith(block);
}
