/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs container
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels and tab panels
  const tabLabelEls = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tablist > li'));
  const tabPanels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tabpanel'));

  // Defensive: only pair up to minimum number of tabs/panels
  const numTabs = Math.min(tabLabelEls.length, tabPanels.length);

  // Header row exactly as required (one column, string)
  const headerRow = ['Tabs (tabs31)'];
  const tableRows = [headerRow];

  // Each tab is a row: [labelText, tabPanelContent], exactly matching the example structure
  for (let i = 0; i < numTabs; i++) {
    // Tab label as plain string
    const labelText = tabLabelEls[i].textContent.trim();
    // Tab content: reference the contentfragment/article if present, else the panel itself
    const content = tabPanels[i].querySelector('article.cmp-contentfragment')
      || tabPanels[i].querySelector('.contentfragment')
      || tabPanels[i];
    tableRows.push([labelText, content]);
  }

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
