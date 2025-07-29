/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get tab label elements
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabelEls = Array.from(tabList.querySelectorAll('[role="tab"]'));
  const tabLabels = tabLabelEls.map(tab => tab.textContent.trim());

  // Get tab panel elements
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[role="tabpanel"]'));

  // Compose rows
  const rows = [];
  // Header row
  rows.push(['Tabs (tabs36)']);
  // Each tab gets its own row: [Tab Label, Tab Content]
  const tabCount = Math.min(tabLabels.length, tabPanels.length);
  for (let i = 0; i < tabCount; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    let content = '';
    if (panel) {
      // Prefer referencing the article if present, else the whole panel
      const article = panel.querySelector('article');
      content = article ? article : panel;
    }
    rows.push([label, content]);
  }
  // Create the table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the tabs block with the generated table
  tabsBlock.replaceWith(table);
}
