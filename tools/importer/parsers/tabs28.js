/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs block inside our provided element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels from the tablist
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabelEls = Array.from(tabList.querySelectorAll('li'));
  const tabLabels = tabLabelEls.map(li => li.textContent.trim());

  // Get all tabpanel elements (in DOM order)
  const tabPanels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tabpanel'));

  // Compose block table rows
  const rows = [];
  // Header row: block name exactly as specified
  rows.push(['Tabs (tabs28)']);

  // Each subsequent row: [Tab Label, Tab Content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const tabPanel = tabPanels[i];
    let contentCell = null;
    if (tabPanel) {
      // Use the .contentfragment if present, else the entire tabPanel
      const cf = tabPanel.querySelector('.contentfragment');
      contentCell = cf ? cf : tabPanel;
    }
    rows.push([label, contentCell]);
  }

  // Create the table using the rows
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabs block in the DOM with the table
  tabsBlock.replaceWith(table);
}
