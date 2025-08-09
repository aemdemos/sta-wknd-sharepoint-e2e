/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the tabs block by its known class structure
  const tabsBlock = element.querySelector('.tabs.panelcontainer');
  if (!tabsBlock) return;

  // Find the cmp-tabs element within the block
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get the tab labels from the tablist
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  const tabLabelNodes = tabList ? Array.from(tabList.querySelectorAll('[role="tab"]')) : [];
  const tabLabels = tabLabelNodes.map(tab => tab.textContent.trim());

  // Get all tab panels which contain the tab content
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[role="tabpanel"]'));

  // Start building the rows for the tabs block table
  const rows = [];
  rows.push(['Tabs (tabs12)']); // Header row must match block name exactly

  // For each tab, add a row with [Tab Label, Tab Content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    if (!label || !panel) continue;

    // For robustness, grab all direct children of the tabpanel (skipping empty grids)
    // We'll filter out empty or mostly empty grid divs
    const contentElements = Array.from(panel.childNodes).filter((node) => {
      if (node.nodeType === 1) {
        // element
        if (
          node.classList.contains('aem-Grid') ||
          node.classList.contains('aem-Grid--12') ||
          node.classList.contains('aem-Grid--default--12')
        ) {
          // skip empty grid wrappers
          return node.textContent.trim().length > 0;
        }
        return true;
      } else if (node.nodeType === 3) {
        // text node
        return node.textContent.trim().length > 0;
      }
      return false;
    });
    // If only one content element, use it directly, otherwise pass as array
    let tabContentCell;
    if (contentElements.length === 1) {
      tabContentCell = contentElements[0];
    } else {
      tabContentCell = contentElements;
    }
    rows.push([label, tabContentCell]);
  }

  // Create the table and replace the tabs block with it
  const table = WebImporter.DOMUtils.createTable(rows, document);
  tabsBlock.replaceWith(table);
}
