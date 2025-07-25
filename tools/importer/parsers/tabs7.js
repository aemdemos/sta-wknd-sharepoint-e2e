/* global WebImporter */
export default function parse(element, { document }) {
  // Find the correct .cmp-tabs element for processing
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Extract tab labels from the tablist
  const tabLabels = Array.from(
    tabsBlock.querySelectorAll('.cmp-tabs__tablist .cmp-tabs__tab')
  ).map(tab => tab.textContent.trim());
  if (!tabLabels.length) return;

  // Get all tabpanel elements in order
  const tabPanels = Array.from(
    tabsBlock.querySelectorAll(':scope > .cmp-tabs__tabpanel, .cmp-tabs__tabpanel')
  );

  // For each tab panel, find the main content to display in the cell
  function extractPanelContent(panel) {
    // Try to find the main content container, e.g., a .cmp-contentfragment, or else use the whole panel
    const cf = panel.querySelector('.cmp-contentfragment, .cmp-contentfragment__elements');
    if (cf) {
      // If there is a redundant title (like h3) that's just the label, remove it to avoid duplication
      const h3 = cf.querySelector('.cmp-contentfragment__title');
      if (h3 && tabLabels.includes(h3.textContent.trim())) {
        h3.remove();
      }
      return cf;
    }
    // Fallback: reference the whole content panel
    return panel;
  }

  // Header row as in the spec
  const headerRow = ['Tabs (tabs7)'];
  // Tabs row: all tab labels in order, one per column
  const labelsRow = tabLabels;
  // Content row: each corresponding tab content, one per column
  const contentsRow = tabPanels.map(extractPanelContent);

  // Table rows: first row is header (single cell), second row tab labels, third row tab content.
  const rows = [headerRow, labelsRow, contentsRow];
  
  // Create the table using the required helper
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the tabs block with the table block
  tabsBlock.replaceWith(table);
}
