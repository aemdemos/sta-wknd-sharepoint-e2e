/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the tabs block within the provided element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Extract tab labels from the tablist
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  const tabLabels = [];
  if (tabList) {
    tabList.querySelectorAll('.cmp-tabs__tab').forEach((li) => {
      tabLabels.push(li.textContent.trim());
    });
  }

  // Extract tab panels in display order
  const tabPanels = Array.from(tabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));
  const tabContents = [];
  for (let i = 0; i < tabLabels.length; i++) {
    // Defensive: panel order should match tab label order
    const panel = tabPanels[i];
    if (panel) {
      tabContents.push(panel);
    } else {
      // If a panel is missing, insert empty cell for that label
      tabContents.push(document.createTextNode(''));
    }
  }

  // Build the table: header, label row, content row
  const cells = [
    ['Tabs (tabs38)'],
    tabLabels,
    tabContents,
  ];

  // Create table and replace the original tabs block
  const block = WebImporter.DOMUtils.createTable(cells, document);
  tabs.replaceWith(block);
}
