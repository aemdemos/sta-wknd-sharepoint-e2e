/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  if (!tabsBlock) return;

  // Find the tab labels (li elements)
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('li'));

  // Find all tab panels
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Defensive: Only process if labels and panels match
  if (tabLabels.length !== tabPanels.length || tabLabels.length === 0) return;

  // Table header row (must match block name exactly)
  const headerRow = ['Tabs (tabs38)'];
  const rows = [headerRow];

  // For each tab, add a row: [Label, Content]
  tabLabels.forEach((labelEl, idx) => {
    const label = labelEl.textContent.trim();
    const panel = tabPanels[idx];
    // Find the main content fragment/article inside the panel
    let contentEl = panel.querySelector('article, .cmp-contentfragment, .cmp-contentfragment__elements, .contentfragment');
    if (!contentEl) {
      contentEl = panel;
    }
    rows.push([label, contentEl]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block with the new table
  tabsBlock.replaceWith(block);
}
