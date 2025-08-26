/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs block (could be .tabs.panelcontainer or just .cmp-tabs)
  let tabsBlock = element.querySelector('.tabs.panelcontainer') || element.querySelector('.cmp-tabs');
  // If tabsBlock is the wrapper, get the actual .cmp-tabs inside it
  let cmpTabs = tabsBlock;
  if (tabsBlock && tabsBlock.classList.contains('tabs') && !tabsBlock.classList.contains('cmp-tabs')) {
    cmpTabs = tabsBlock.querySelector('.cmp-tabs');
  }
  if (!cmpTabs) return;

  // Extract tab labels from .cmp-tabs__tablist
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  const tabLabels = [];
  if (tabList) {
    tabList.querySelectorAll('.cmp-tabs__tab').forEach(tab => {
      tabLabels.push(tab.textContent.trim());
    });
  }

  // Extract tab panel contents
  const tabPanels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tabpanel'));
  // If number of panels does not match labels, something is wrong, but we proceed with what exists
  const tabContents = tabPanels.map(tabPanel => {
    // Try to extract the main content for each tab
    // Prefer .contentfragment, but if not present use whole tabPanel
    const contentFragment = tabPanel.querySelector('.contentfragment');
    if (contentFragment) {
      return contentFragment;
    } else {
      // If no contentfragment, use the entire tabPanel
      return tabPanel;
    }
  });

  // Construct table matching the example structure
  // First row: header with block name
  // Second row: tab labels (each column is a tab)
  // Third row: tab contents (each column is a tab content)
  const headerRow = ['Tabs (tabs38)'];
  const labelsRow = tabLabels.length ? tabLabels : ['Tab']; // fallback if missing
  const contentRow = tabContents.length ? tabContents : [''];

  const cells = [
    headerRow,
    labelsRow,
    contentRow
  ];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace tabsBlock in DOM
  if (tabsBlock) {
    tabsBlock.replaceWith(block);
  }
}
