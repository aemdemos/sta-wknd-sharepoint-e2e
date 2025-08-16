/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.tabs .cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels (li[role=tab])
  const tabList = tabsBlock.querySelector('ol[role="tablist"]');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('li[role="tab"]'));
  if (!tabLabels.length) return;

  // Get tab panels (div[role=tabpanel])
  const tabPanels = Array.from(tabsBlock.querySelectorAll('div[role="tabpanel"]'));
  if (!tabPanels.length) return;
  // Pair labels and panels by index. Defensive: only as many as the minimum
  const count = Math.min(tabLabels.length, tabPanels.length);

  // Header row: block name (single cell)
  const headerRow = ['Tabs (tabs8)'];

  // Second row: tab labels (one per column, use plain text in <strong>)
  const tabLabelRow = tabLabels.slice(0, count).map(label => {
    const strong = document.createElement('strong');
    strong.textContent = label.textContent.trim();
    return strong;
  });

  // Third row: tab content (one per column, reference existing elements)
  const tabContentRow = tabPanels.slice(0, count).map(panel => {
    // Use .contentfragment > article if present, else panel itself
    let content = panel.querySelector('.contentfragment > article') || panel;
    // Remove <h3.cmp-contentfragment__title> if present (repeated in all panels)
    const title = content.querySelector('.cmp-contentfragment__title');
    if (title) title.remove();
    // Return the main content element
    return content;
  });

  // Compose table rows as per spec
  const cells = [headerRow, tabLabelRow, tabContentRow];

  // Create the table and replace element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
