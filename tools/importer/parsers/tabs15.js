/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block in the source HTML
  const tabsBlock = element.querySelector('.tabs .cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels (li elements)
  const tabLabels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tablist > li'));

  // Get tab panels (divs with role="tabpanel")
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[role="tabpanel"]'));

  // Defensive: Only proceed if we have the same number of labels and panels
  if (tabLabels.length !== tabPanels.length || tabLabels.length === 0) return;

  // Table header row
  const headerRow = ['Tabs (tabs15)'];
  const rows = [headerRow];

  // For each tab, build a row: [label, content]
  tabLabels.forEach((labelEl, i) => {
    // Tab label text
    const tabLabel = labelEl.textContent.trim();

    // Tab panel content
    const panelEl = tabPanels[i];
    // Defensive: If no panel, skip
    if (!panelEl) return;

    // For resilience, grab the entire contentfragment/article inside the panel
    const contentFragment = panelEl.querySelector('article') || panelEl;

    // Build row: [Tab Label, Tab Content]
    rows.push([tabLabel, contentFragment]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabs block with the new table
  tabsBlock.replaceWith(block);
}
