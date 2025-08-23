/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.tabs.panelcontainer');
  if (!tabsBlock) return;

  // The tabs component
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels
  const tabLabelEls = cmpTabs.querySelectorAll('.cmp-tabs__tablist > li');
  const tabLabels = Array.from(tabLabelEls).map(li => {
    // Keep any formatting inside tab label (e.g. <b> or <span>)
    return li.textContent.trim();
  });

  // Get tab panels (content)
  const tabPanels = cmpTabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]');

  // Defensive: If no tabs, skip
  if (tabLabels.length === 0 || tabPanels.length === 0) return;

  // Build header
  const headerRow = ['Tabs (tabs7)']; // Per instructions, this is the only header
  // Build tab label row
  const tabLabelRow = tabLabels;

  // Each tab content cell: use the contentfragment article element if present; otherwise all children.
  const tabContentRow = Array.from(tabPanels).map(panel => {
    // If article is present, use it directly (preserves all semantics and structure)
    const article = panel.querySelector('article');
    if (article) return article;
    // Otherwise, group all children (to handle edge cases)
    return Array.from(panel.childNodes).filter(node => {
      // Remove empty text nodes
      return !(node.nodeType === Node.TEXT_NODE && !node.textContent.trim());
    });
  });

  // Structure: header row, tab label row, tab content row
  const cells = [headerRow, tabLabelRow, tabContentRow];

  // Create table and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  tabsBlock.replaceWith(block);
}
