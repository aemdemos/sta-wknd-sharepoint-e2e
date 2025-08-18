/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the .cmp-tabs block (the tabs30 block)
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Find the tab labels
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  const tabLabels = tabList ? Array.from(tabList.children) : [];

  // Find the tab panels (in DOM order)
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Compose the header row as in the spec
  const headerRow = ['Tabs (tabs30)'];
  const rows = [headerRow];

  // For each tab: get label (as element) and the content (reference the existing article or main content node)
  for (let i = 0; i < tabLabels.length && i < tabPanels.length; i++) {
    // Use the tab label's textContent for the left cell. Use an element for consistency/robustness
    const label = document.createElement('span');
    label.textContent = tabLabels[i].textContent.trim();

    // For content, reference the main article or content fragment node inside the tab panel
    const panel = tabPanels[i];
    let contentEl = panel.querySelector('article, .cmp-contentfragment, .contentfragment');
    if (!contentEl) {
      // Fallback to the first child or the panel itself if empty
      contentEl = panel.firstElementChild || panel;
    }

    rows.push([label, contentEl]);
  }

  // Create the block table
  const blockTable = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the full .cmp-tabs block with the new table
  tabsBlock.replaceWith(blockTable);
}
