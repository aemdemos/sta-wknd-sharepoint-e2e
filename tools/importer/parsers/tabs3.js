/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block in the given element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Extract the tab labels from the tablist
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  const tabLabels = Array.from(tabList ? tabList.querySelectorAll('.cmp-tabs__tab') : []).map(tab => tab.textContent.trim());

  // Extract all tab panel content in source order
  const tabPanels = Array.from(tabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Build the table header
  const headerRow = ['Tabs (tabs3)'];

  // For each tab, create a row: [label, content]
  const rows = tabLabels.map((label, i) => {
    // Create tab label element (match example: bold)
    const strongLabel = document.createElement('strong');
    strongLabel.textContent = label;

    // Get the content fragment or main content for this tab
    const tabPanel = tabPanels[i];
    let tabContent = '';
    if (tabPanel) {
      // There is usually a single contentfragment/article child inside the tabpanel
      // Just reference the first child if present, else reference the tabPanel itself
      let mainContent = null;
      for (let j = 0; j < tabPanel.children.length; j++) {
        const child = tabPanel.children[j];
        if (
          child.classList.contains('contentfragment') ||
          child.tagName === 'ARTICLE' ||
          child.classList.contains('cmp-contentfragment')
        ) {
          mainContent = child;
          break;
        }
      }
      tabContent = mainContent || tabPanel;
    }
    return [strongLabel, tabContent];
  });

  // Compose the table data: header + tab rows
  const cells = [headerRow, ...rows];

  // Create the block table and replace the original element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
