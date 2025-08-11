/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cmp-tabs block relative to the provided element.
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels from the tablist
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  const tabLabels = [];
  const tabPanels = [];

  // Defensive extraction of tab labels and their corresponding tabpanels
  if (tabList) {
    Array.from(tabList.children).forEach((li) => {
      tabLabels.push(li.textContent.trim());
      // aria-controls links to tabpanel's id
      const tabPanelId = li.getAttribute('aria-controls');
      // The tabpanel is a child of tabsBlock
      const panel = tabPanelId ? tabsBlock.querySelector(`#${tabPanelId}`) : null;
      tabPanels.push(panel);
    });
  }

  // Build table header -- block name EXACTLY as required
  const cells = [['Tabs (tabs38)']];
  // Second row: tab labels, each cell in a single row
  cells.push(tabLabels);

  // Third row: tab content -- for each tab, reference the actual .cmp-tabs__tabpanel child (not a clone)
  // We'll grab the panel element itself if present, otherwise an empty string.
  // Reference rather than clone for semantic and resilience reasons
  const tabContentRow = tabPanels.map(panel => {
    if (!panel) return '';
    // If the panel only contains a single wrapper, use its contents
    // If it is empty, return ''
    // We want the visible content, not the wrapping element only
    // Let's try to reference the actual content inside the tabpanel
    // But since the content may be deeply nested, reference the tabpanel itself
    return panel;
  });
  cells.push(tabContentRow);

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the tabs block with the new table
  tabsBlock.replaceWith(table);
}
