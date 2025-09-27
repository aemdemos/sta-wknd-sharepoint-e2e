/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the main tabs block
  const tabsBlock = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  let cmpTabs = tabsBlock;
  if (!cmpTabs || !cmpTabs.classList.contains('cmp-tabs')) {
    cmpTabs = tabsBlock && tabsBlock.querySelector('.cmp-tabs');
  }
  if (!cmpTabs) return;

  // Extract tab labels
  const tabLabels = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab')
  ).map(tab => tab.textContent.trim());

  // Extract tab panels (tab content)
  const tabPanels = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Build rows: each row is [Tab Label, Tab Content]
  const rows = [];
  for (let i = 0; i < tabLabels.length && i < tabPanels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    // Use the contentfragment/article inside each tabpanel, or fallback to the panel itself
    let content = panel.querySelector('.cmp-contentfragment, article');
    if (!content) content = panel;
    rows.push([label, content]);
  }

  // Table header must match block name exactly
  const headerRow = ['Tabs (tabs11)'];
  const tableCells = [headerRow, ...rows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableCells, document);

  // Replace the tabs block with the new table
  tabsBlock.replaceWith(block);
}
