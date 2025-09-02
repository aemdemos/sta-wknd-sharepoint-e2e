/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block by its distinctive cmp-tabs class
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get all tab labels (li.cmp-tabs__tab)
  const tabLabels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tab'));
  // Get all tab panels (div[role=tabpanel]) - these contain the tab content
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[role="tabpanel"]'));

  // Prepare the table header row, per example
  const headerRow = ['Tabs (tabs20)'];
  const cells = [headerRow];

  // For each tab label and panel, add a row: [label, panel content]
  tabLabels.forEach(labelElem => {
    const label = labelElem.textContent.trim();
    const tabId = labelElem.getAttribute('id');
    // Find the corresponding tabpanel by aria-labelledby
    const panel = tabPanels.find(p => p.getAttribute('aria-labelledby') === tabId);
    let contentCell = null;
    if (panel) {
      // To avoid removing nodes from the DOM, reference the .contentfragment or tab panel content
      // Find the first article/contentfragment if present
      let mainContent = panel.querySelector('article, .contentfragment');
      // If not found, reference all children
      if (mainContent) {
        contentCell = mainContent;
      } else {
        // If no .contentfragment, just reference all panel children in a wrapper
        const div = document.createElement('div');
        Array.from(panel.childNodes).forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.TEXT_NODE) {
            div.appendChild(node);
          }
        });
        contentCell = div;
      }
    }
    cells.push([label, contentCell]);
  });

  // Create the block table with the extracted cells
  const block = WebImporter.DOMUtils.createTable(cells, document);
  tabsBlock.replaceWith(block);
}
