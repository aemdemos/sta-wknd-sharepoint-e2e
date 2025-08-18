/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block within the provided element
  const tabsBlock = element.querySelector('.tabs .cmp-tabs');
  if (!tabsBlock) return;

  // Get the tab labels from the main tablist (li role=tab)
  const tabLabels = Array.from(
    tabsBlock.querySelectorAll('.cmp-tabs__tablist [role="tab"]')
  ).map(tab => tab.textContent.trim());

  // Get the tab panels (content) - each has [role=tabpanel]
  const tabPanels = Array.from(
    tabsBlock.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Defensive: Tab panel count matches label count
  // If not, we skip or fill with empty
  while (tabPanels.length < tabLabels.length) {
    tabPanels.push(document.createElement('div'));
  }

  // Compose the header row for the block (must match exactly)
  const headerRow = ['Tabs (tabs33)'];

  // Compose rows: each row is [label, content]
  const rows = [headerRow];
  for (let i = 0; i < tabLabels.length; i++) {
    const labelCell = tabLabels[i];
    let contentCell;
    // Use the contentfragment/article inside the tabpanel if present
    const panel = tabPanels[i];
    // Look for article.cmp-contentfragment inside panel
    const fragment = panel.querySelector('article.cmp-contentfragment, div.contentfragment');
    if (fragment) {
      contentCell = fragment;
    } else {
      // If not found, use the whole tab panel
      contentCell = panel;
    }
    rows.push([labelCell, contentCell]);
  }

  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
