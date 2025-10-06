/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels from tablist
  const tabLabels = Array.from(
    tabsBlock.querySelectorAll('.cmp-tabs__tablist .cmp-tabs__tab')
  );

  // Get tab panels (content)
  const tabPanels = Array.from(
    tabsBlock.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Table header must match target block name exactly
  const headerRow = ['Tabs (tabs13)'];
  const rows = [headerRow];

  // For each tab, add a row: [label, content]
  tabLabels.forEach((tabLabel, i) => {
    const label = tabLabel.textContent.trim();
    const panel = tabPanels[i];
    let tabContent;
    if (panel) {
      // Use the referenced panel element (not a clone)
      tabContent = panel;
    } else {
      // If missing, create an empty cell
      tabContent = document.createElement('div');
    }
    rows.push([label, tabContent]);
  });

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block with the new block
  tabsBlock.replaceWith(block);
}
