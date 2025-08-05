/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block by class (cmp-tabs)
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get all tab labels in order (text)
  const tabLabels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get all tab panels in order (these hold tab content)
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Table header row (block name and variant as in example)
  const headerRow = ['Tabs (tabs31)'];
  const rows = [headerRow];

  // Defensive: handle mismatch between labels and panels
  const numTabs = Math.min(tabLabels.length, tabPanels.length);
  for (let i = 0; i < numTabs; i++) {
    // Column 1: tab label (preserve text only, no markup)
    const tabLabel = tabLabels[i]?.textContent?.trim() || '';
    // Column 2: tab content - reference existing relevant element (full contentfragment/article block)
    // The content for each tab is the main .contentfragment inside the panel (if present),
    // otherwise the panel itself
    let contentEl = null;
    const contentfragment = tabPanels[i].querySelector('.contentfragment');
    if (contentfragment) {
      contentEl = contentfragment;
    } else {
      contentEl = tabPanels[i];
    }
    rows.push([tabLabel, contentEl]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the entire .cmp-tabs block with our table
  tabsBlock.replaceWith(block);
}
