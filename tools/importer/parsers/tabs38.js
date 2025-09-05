/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the tabs block
  const tabsBlock = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  if (!tabsBlock) return;

  // Find the tab labels (li elements)
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('li'));

  // Find all tab panels (divs with role="tabpanel")
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[role="tabpanel"]'));

  // Defensive: Ensure labels and panels match
  if (tabLabels.length !== tabPanels.length || tabLabels.length === 0) return;

  // Table header row
  const headerRow = ['Tabs (tabs38)'];
  const rows = [headerRow];

  // For each tab, add a row: [label, content]
  tabLabels.forEach((labelEl, i) => {
    // Defensive: Get label text
    const label = labelEl.textContent.trim();
    // Defensive: Get panel content
    const panel = tabPanels[i];
    // For content, use the full tabpanel div (preserves all structure)
    rows.push([label, panel]);
  });

  // Create the block table
  const blockTable = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabs block with the table
  tabsBlock.replaceWith(blockTable);
}
