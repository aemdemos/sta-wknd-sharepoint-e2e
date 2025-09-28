/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  if (!tabsBlock) return;

  // Find the cmp-tabs element
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Extract tab labels
  const tabLabels = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tablist .cmp-tabs__tab')
  ).map(tab => tab.textContent.trim());

  // Extract tab panels (content)
  const tabPanels = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Defensive: Ensure labels and panels match
  if (tabLabels.length !== tabPanels.length) return;

  // Table header row (must match target block name exactly)
  const headerRow = ['Tabs (tabs13)'];

  // Each tab: [label, content]
  const rows = tabLabels.map((label, idx) => {
    // Tab content: reference the panel DOM node directly
    return [label, tabPanels[idx]];
  });

  // Compose table
  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace tabs block with the new block table
  tabsBlock.replaceWith(block);
}
