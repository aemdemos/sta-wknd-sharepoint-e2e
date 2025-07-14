/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs block
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels (li elements)
  const tabLabels = Array.from(
    tabsBlock.querySelectorAll(':scope > ol.cmp-tabs__tablist > li')
  );

  // Get tab panels corresponding to each tab label
  const tabPanels = Array.from(
    tabsBlock.querySelectorAll(':scope > div[role="tabpanel"]')
  );

  // Header row: must be single column
  const rows = [['Tabs (tabs19)']];

  // Each subsequent row: [tab label, tab content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i] ? tabLabels[i].textContent.trim() : '';
    let panel = tabPanels[i];
    // Defensive: fallback to empty cell if no panel exists
    let contentNode = '';
    if (panel) {
      contentNode = panel.querySelector('article, .contentfragment') || panel;
    }
    rows.push([label, contentNode]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element with the new table
  element.replaceWith(table);
}
