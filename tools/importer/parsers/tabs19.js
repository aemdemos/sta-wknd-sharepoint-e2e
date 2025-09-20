/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block in the source HTML
  const tabsBlock = element.querySelector('.tabs .cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels from the tablist
  const tabLabels = Array.from(
    tabsBlock.querySelectorAll('.cmp-tabs__tablist > li[role="tab"]')
  ).map(tab => tab.textContent.trim());

  // Get tab panels (content for each tab)
  const tabPanels = Array.from(
    tabsBlock.querySelectorAll('[role="tabpanel"]')
  );

  // Defensive: ensure labels and panels match
  const tabCount = Math.min(tabLabels.length, tabPanels.length);

  // Build the header row
  const headerRow = ['Tabs (tabs19)'];

  // Build the tab rows
  const rows = [];
  for (let i = 0; i < tabCount; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];

    // Defensive: find the main content fragment/article inside the tab panel
    let tabContent = null;
    // Prefer the article element, but fallback to the panel itself
    tabContent = panel.querySelector('article') || panel;

    // Place the label and content fragment in the row
    rows.push([label, tabContent]);
  }

  // Compose the table data
  const cells = [headerRow, ...rows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
