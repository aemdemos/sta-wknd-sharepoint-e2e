/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs block (by class 'cmp-tabs')
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels (li elements inside ol[role="tablist"])
  const tabList = tabsBlock.querySelector('ol[role="tablist"]');
  if (!tabList) return;
  const tabLabelElements = Array.from(tabList.querySelectorAll('li[role="tab"]'));

  // Get tab content panels (divs with data-cmp-hook-tabs="tabpanel")
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Defensive: Only proceed if we have at least 1 label and as many tab panels as labels
  if (tabLabelElements.length === 0 || tabPanels.length < tabLabelElements.length) return;

  // Build header row
  const headerRow = ['Tabs (tabs23)'];

  // Build tab label row: each cell contains the tab text (preserving bold for active tab as in screenshot)
  const tabHeaderRow = tabLabelElements.map(lbl => {
    // Preserve semantics: bold active tab using <strong>
    if (lbl.getAttribute('aria-selected') === 'true') {
      const strong = document.createElement('strong');
      strong.textContent = lbl.textContent.trim();
      return strong;
    }
    // Non-active tab: plain text
    return lbl.textContent.trim();
  });

  // Build tab content row: each cell holds the DOM content for that tab
  const tabContentRow = tabPanels.map(tabPanel => {
    // Contentfragment is the main content inside each tabpanel
    const fragment = tabPanel.querySelector('.contentfragment');
    if (fragment) return fragment;
    // Fallback to whole tabPanel if fragment is missing
    return tabPanel;
  });

  // Assemble table: header row, tab label row, tab content row
  // This matches the example structure: 1 header row, 1 tab label row, 1 tab content row
  const cells = [
    headerRow,
    tabHeaderRow,
    tabContentRow
  ];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original tabs block with the new table
  tabsBlock.replaceWith(table);
}
