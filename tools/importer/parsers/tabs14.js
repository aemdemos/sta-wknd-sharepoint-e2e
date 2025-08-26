/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs block: look for the .cmp-tabs within the section
  let tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Find the tab labels (li elements inside .cmp-tabs__tablist)
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('li[role="tab"]'));
  if (!tabLabels.length) return;

  // Find all tab panels (content for each tab)
  const tabPanels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tabpanel'));
  if (!tabPanels.length) return;
  
  // The header row: block name exactly as required
  const headerRow = ['Tabs (tabs14)'];

  // The next row is the tab label row, using only the label text
  const tabLabelRow = tabLabels.map(tab => {
    // Use <strong> for tab labels as in the example
    const strong = document.createElement('strong');
    strong.textContent = tab.textContent.trim();
    return strong;
  });

  // The next row is the tab contents, referencing the main content node in each tab panel
  // We'll search for the first significant child in each tabpanel (e.g. article, .contentfragment, etc)
  const tabContentRow = tabPanels.map(tabPanel => {
    // Get first non-empty direct child content node
    // Prefer article, .contentfragment, fallback to the tabPanel itself
    let content = tabPanel.querySelector('article, .contentfragment');
    if (!content) {
      // Remove empty .aem-Grid children
      const temp = Array.from(tabPanel.childNodes).filter(node => {
        // Remove all empty text nodes and empty .aem-Grid divs
        if (node.nodeType === Node.TEXT_NODE && !node.textContent.trim()) return false;
        if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains('aem-Grid') && !node.textContent.trim()) return false;
        return true;
      });
      if (temp.length === 1) content = temp[0];
      else content = tabPanel;
    }
    return content;
  });

  // Compose the rows for the table matching the example (header, tabs, content)
  const cells = [
    headerRow,
    tabLabelRow,
    tabContentRow
  ];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  
  // Replace the tabs block with our new block
  tabsBlock.parentNode.replaceChild(table, tabsBlock);
}
