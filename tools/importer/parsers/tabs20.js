/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the .cmp-tabs block inside the element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels from the tablist (ol > li)
  const tabLabels = Array.from(
    tabsBlock.querySelectorAll('.cmp-tabs__tablist > li')
  ).map(li => li.textContent.trim());

  // Get tab panels (content for each tab)
  const tabPanels = Array.from(
    tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]')
  );

  // Build table rows: header first, then one row per tab
  const cells = [];
  const headerRow = ['Tabs (tabs20)'];
  cells.push(headerRow);

  // For each tab, add a row: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    // Defensive: skip if panel missing
    if (!panel) continue;
    // For content, reference the entire panel's contentfragment/article block
    // Find the first .contentfragment or article inside the panel
    let content = panel.querySelector('.contentfragment') || panel.querySelector('article') || panel;
    cells.push([label, content]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original tabs block with the new table
  tabsBlock.replaceWith(block);
}
