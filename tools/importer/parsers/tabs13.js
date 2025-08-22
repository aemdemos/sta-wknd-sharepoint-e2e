/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the tabs block (cmp-tabs)
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Extract tab labels from the tablist
  const tabLabels = [];
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  tabList.querySelectorAll(':scope > li').forEach(tabNode => {
    tabLabels.push(tabNode.textContent.trim());
  });

  // Extract tabpanel content (in order)
  const tabPanels = tabsBlock.querySelectorAll('.cmp-tabs__tabpanel');

  // Prepare the table: header, tab label row, tab content row
  const table = [];
  // Header row: block name exactly as required
  table.push(['Tabs (tabs13)']);
  // Tab label row
  table.push(tabLabels);
  // Tab content row
  const tabContents = [];
  tabPanels.forEach(tabPanel => {
    // For each panel, reference the first content fragment/article if present, else the panel
    const contentFrag = tabPanel.querySelector('article') || tabPanel;
    tabContents.push(contentFrag);
  });
  table.push(tabContents);

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(table, document);
  // Replace the tabs block with the new block table
  tabsBlock.replaceWith(block);
}
