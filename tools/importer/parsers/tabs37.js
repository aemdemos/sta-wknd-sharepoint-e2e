/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the tabs block (class cmp-tabs); must exist
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels as text
  const tabItems = Array.from(
    tabsBlock.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab')
  );
  const tabLabels = tabItems.map(tab => tab.textContent.trim());

  // Get tab panel elements; each corresponds to a tab label
  const tabPanels = Array.from(
    tabsBlock.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Build header row
  const headerRow = ["Tabs (tabs37)"];

  // Build tab rows, each row: [label, content]
  const rows = tabLabels.map((label, idx) => {
    // Find matching tab panel
    const tabPanel = tabPanels[idx];
    let content;
    if (tabPanel) {
      // Defensive: if tabPanel exists, extract primary content
      // Try to use contentfragment's .cmp-contentfragment__elements if present, else use tabPanel itself
      const cfElements = tabPanel.querySelector('.cmp-contentfragment__elements');
      if (cfElements) {
        // Some tabs have additional wrapper divs (sometimes empty), so get the content inside cfElements
        // If cfElements contains inner divs, include them all, but always reference existing elements
        content = cfElements;
      } else {
        // If not present, use the entire tabPanel
        content = tabPanel;
      }
    } else {
      // If missing, leave cell empty
      content = '';
    }
    // Reference label as plain text, NOT hardcoded; use as string for accessibility and consistency
    return [label, content];
  });

  // Compose the final cells array
  const cells = [headerRow, ...rows];

  // Create the block table and replace the original tabs block element
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);
  tabsBlock.replaceWith(blockTable);
}
