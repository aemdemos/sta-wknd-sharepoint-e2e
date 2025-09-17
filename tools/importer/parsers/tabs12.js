/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the tabs block inside the element
  const tabsBlock = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  if (!tabsBlock) return;

  // Find the tab labels (li elements)
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('li'));

  // Find all tab panels (div[role=tabpanel])
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[role="tabpanel"]'));

  // Defensive: ensure labels and panels match
  if (tabLabels.length !== tabPanels.length) return;

  // Build table rows
  const rows = [];
  // Header row as required
  rows.push(['Tabs (tabs12)']);

  // For each tab, add a row: [tab label, tab content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];

    // Defensive: find the actual content inside the tab panel
    // Usually a contentfragment/article
    let content = null;
    // Prefer the whole article if present
    const article = panel.querySelector('article');
    if (article) {
      content = article;
    } else {
      // fallback: use the panel itself
      content = panel;
    }
    rows.push([label, content]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabs block with the new table
  tabsBlock.replaceWith(block);
}
