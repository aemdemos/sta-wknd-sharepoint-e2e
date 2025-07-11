/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block within the provided element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Tab list and tab items
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  const tabItems = Array.from(tabList ? tabList.querySelectorAll('li') : []);
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Build table rows: header as single column, then each tab row as 2 columns
  const rows = [];
  // Header row: single column, exactly as the example (no extra cells)
  rows.push(['Tabs (tabs9)']);

  // Each tab row: [Tab Label, Tab Content]
  for (let i = 0; i < tabItems.length; i++) {
    const labelLi = tabItems[i];
    const panel = tabPanels[i];
    if (!labelLi || !panel) continue;
    // Tab label as textContent in a <span>
    const labelText = labelLi.textContent.trim();
    const labelSpan = document.createElement('span');
    labelSpan.textContent = labelText;
    // Content: ref the article (if present), otherwise panel.
    let tabContent;
    const article = panel.querySelector('article');
    if (article) {
      tabContent = article;
    } else {
      tabContent = panel;
    }
    rows.push([labelSpan, tabContent]);
  }

  // Create the table and replace the block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  tabsBlock.replaceWith(table);
}
