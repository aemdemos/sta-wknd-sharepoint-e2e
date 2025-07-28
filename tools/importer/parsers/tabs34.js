/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs element within the provided element
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get all tab labels from the tablist
  const tabList = tabsRoot.querySelector('.cmp-tabs__tablist');
  const tabLabelNodes = tabList ? tabList.querySelectorAll('li') : [];
  const tabLabels = Array.from(tabLabelNodes).map(tab => tab.textContent.trim());
  
  // Get all tab panels (tabpanel divs)
  const tabPanels = tabsRoot.querySelectorAll('.cmp-tabs__tabpanel');

  // Build the header row
  const headerRow = ['Tabs (tabs34)'];
  // Build the row with all tab labels as per example: each label is a cell in this row
  const tabHeaderRow = tabLabels;

  // Now, for each tab panel, match its label and extract the content
  const tabContentRows = Array.from(tabPanels).map(tabPanel => {
    // Find this tab's label by looking at aria-labelledby
    const labelledby = tabPanel.getAttribute('aria-labelledby');
    let label = '';
    if (labelledby) {
      const tabElem = tabList ? tabList.querySelector(`#${labelledby}`) : null;
      if (tabElem) {
        label = tabElem.textContent.trim();
      } else {
        // fallback: try in tabsRoot
        const fallbackTab = tabsRoot.querySelector(`#${labelledby}`);
        label = fallbackTab ? fallbackTab.textContent.trim() : '';
      }
    }
    // The tab content is the content inside tabPanel. Per instructions, reference the whole tabPanel content (not cloning)
    // But we want only the content fragment, if present
    let tabContent = tabPanel.querySelector('article.cmp-contentfragment') || tabPanel;
    return [label, tabContent];
  });

  // Compose the table rows: header, label row, tab rows
  const cells = [
    headerRow,
    tabHeaderRow,
    ...tabContentRows
  ];

  // Create the table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the .cmp-tabs with the block table
  tabsRoot.replaceWith(block);
}
