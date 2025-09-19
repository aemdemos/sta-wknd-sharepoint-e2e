/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  if (!tabsBlock) return;

  // Find the cmp-tabs (tab container)
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get all tab labels (li elements)
  const tabLabels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get all tab panels (tabpanel divs)
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Only process if labels and panels match
  if (tabLabels.length !== tabPanels.length || tabLabels.length === 0) return;

  // Table header row as required
  const headerRow = ['Tabs (tabs27)'];
  const rows = [headerRow];

  // For each tab, create a row: [label, content]
  tabLabels.forEach((labelEl, i) => {
    const tabLabel = labelEl.textContent.trim();
    const tabPanel = tabPanels[i];
    if (!tabPanel) return;

    // Prefer the immediate contentfragment/article inside the tabPanel
    let tabContent = tabPanel.querySelector('.cmp-contentfragment') || tabPanel.querySelector('article');
    if (!tabContent) tabContent = tabPanel;

    rows.push([
      tabLabel,
      tabContent
    ]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabs block with the new table
  tabsBlock.replaceWith(block);
}
