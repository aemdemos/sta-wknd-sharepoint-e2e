/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Extract the tab labels in order
  const tabLabels = Array.from(
    tabsBlock.querySelectorAll('.cmp-tabs__tablist > li')
  ).map(li => li.textContent.trim());

  // Extract tab panels in order (tabpanels are in order, matching tabLabels)
  const tabPanels = Array.from(
    tabsBlock.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Defensive: If for any reason there is a mismatch in count, bail out
  if (tabLabels.length !== tabPanels.length) {
    // Fallback: do nothing (or could throw). But for robustness, just return
    return;
  }

  // Table rows
  // 1. Header row
  const headerRow = ['Tabs (tabs25)'];

  // 2. Tabs label row (all tab labels, in columns)
  const labelsRow = tabLabels;

  // 3. Content row (all tab contents as elements, in columns)
  // For each panel, grab its meaningful content (usually the .contentfragment/article)
  const contentRow = tabPanels.map(panel => {
    // Try to find the meaningful content inside the tab panel
    let mainContent = panel.querySelector('article.cmp-contentfragment');
    if (!mainContent) {
      // fallback: first .contentfragment
      mainContent = panel.querySelector('.contentfragment');
    }
    if (!mainContent) {
      // fallback: just the first non-empty direct element child
      mainContent = Array.from(panel.children).find(n => n.textContent.trim().length > 0) || panel;
    }
    return mainContent;
  });

  // Compose the table block (header, tabs, content)
  const cells = [
    headerRow,
    labelsRow,
    contentRow
  ];

  // Create the block table
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the tabs block with the new table
  tabsBlock.replaceWith(blockTable);
}
