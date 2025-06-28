/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs block
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels from <ol class="cmp-tabs__tablist">
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.children).map(li => li.textContent.trim());

  // Get all tab panels in DOM order
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));
  if (!tabPanels.length) return;

  // Build header row as in the example
  const rows = [['Tabs (tabs34)']];

  // Each row: [Tab Label, Tab Content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    if (!panel) continue;
    // The content should be the main contentfragment/article inside the panel for semantic meaning
    let content = null;
    const article = panel.querySelector('article');
    if (article) {
      content = article;
    } else {
      // fallback: whole panel
      content = panel;
    }
    rows.push([label, content]);
  }

  // Create and replace with table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  tabsBlock.replaceWith(block);
}
