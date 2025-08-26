/* global WebImporter */
export default function parse(element, { document }) {
  // Find .cmp-tabs block
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels (OL > LI)
  const tablist = tabsBlock.querySelector('[role="tablist"]');
  const tabLabels = tablist ? Array.from(tablist.children).map(li => li.textContent.trim()) : [];

  // Get tabpanel contents in the same order
  const tabpanels = Array.from(tabsBlock.querySelectorAll('[role="tabpanel"]'));
  const tabContents = tabpanels.map(tabpanel => {
    const content = tabpanel.querySelector('.contentfragment');
    return content ? content : tabpanel;
  });

  // Only proceed if counts match
  if (tabLabels.length === 0 || tabLabels.length !== tabContents.length) return;

  // Table: 1 header row, 1 label row, 1 content row
  const cells = [
    ['Tabs (tabs15)'],   // Header row - single cell
    tabLabels,          // Tab label row - one cell per tab
    tabContents         // Content row - one cell per tab
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
