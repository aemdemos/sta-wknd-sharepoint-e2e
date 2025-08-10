/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get the tab labels in order
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  const tabLabelEls = tabList ? tabList.querySelectorAll('[role="tab"]') : [];
  const tabLabels = Array.from(tabLabelEls).map(tab => tab.textContent.trim());

  // Get the tab panels in order
  const tabPanels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tabpanel'));
  // Defensive: Match panels to labels by order

  // Build the header row
  const headerRow = ['Tabs (tabs38)'];
  const tableRows = [headerRow];

  // For each tab, create a row [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i] || '';
    const panel = tabPanels[i] || null;
    let contentCell = '';
    if (panel) {
      // Remove aria-hidden so all content is visible in import/export context
      panel.removeAttribute('aria-hidden');
      contentCell = panel;
    }
    tableRows.push([label, contentCell]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
