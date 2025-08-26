/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .tabs block: it can be nested under different wrappers so search for class 'tabs' then '.cmp-tabs'
  const tabsWrapper = element.querySelector('.tabs');
  if (!tabsWrapper) return;
  const cmpTabs = tabsWrapper.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get all tab labels (li elements)
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('li'));
  if (tabLabels.length === 0) return;

  // Get all tab panels
  // The panels have [data-cmp-hook-tabs="tabpanel"] and the order matches the tabLabels
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));
  // Defensive: if tabs and panels do not match, stop
  if (tabLabels.length !== tabPanels.length) return;

  // Construct the table rows
  const rows = [];
  // Header row (block name) - single cell
  rows.push(['Tabs (tabs36)']);
  // Second row: all tab labels as in the rendered example
  rows.push(tabLabels.map(li => li.textContent.trim()));

  // For each tab, gather its content for the cell in its column
  // Each tab content row should have the content under its tab, in the right column, others empty
  for (let i = 0; i < tabPanels.length; i++) {
    const row = new Array(tabPanels.length).fill('');
    // Best-effort: grab meaningful content from the tabPanel
    // Try to use the first article.cmp-contentfragment, or fallback to the whole panel
    const panel = tabPanels[i];
    let mainContent = null;
    const cfArticle = panel.querySelector('article.cmp-contentfragment');
    if (cfArticle) {
      // Try to find the div.cmp-contentfragment__elements if it exists, else the article
      const elDiv = cfArticle.querySelector('.cmp-contentfragment__elements');
      mainContent = elDiv ? elDiv : cfArticle;
    } else {
      // Fallback: the content of the tabpanel
      // If the panel contains a div.contentfragment, use that, else the panel
      const cfDiv = panel.querySelector('.contentfragment');
      mainContent = cfDiv ? cfDiv : panel;
    }
    row[i] = mainContent;
    rows.push(row);
  }

  // Create the table block using helper
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original cmpTabs element with the block table
  cmpTabs.replaceWith(block);
}
