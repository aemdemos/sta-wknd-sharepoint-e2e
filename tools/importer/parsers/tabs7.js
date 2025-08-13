/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabs = element.querySelector('.tabs .cmp-tabs');
  if (!tabs) return;

  // Get tab labels from tablist in order
  const tablist = tabs.querySelector('.cmp-tabs__tablist');
  const tabLabels = tablist ? Array.from(tablist.children).map(li => li.textContent.trim()) : [];

  // Get all tabpanel elements (in order)
  const tabPanels = Array.from(tabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Compose the header row, exactly as specified
  const headerRow = ['Tabs (tabs7)'];

  // Tab labels row: one label per column
  const labelsRow = tabLabels;

  // For each tab panel, extract its content for a single row with multiple cells
  const contentRow = tabPanels.map(tabPanel => {
    // Try to find the main content area
    // Usually there is one .contentfragment or direct content children
    const contentFragment = tabPanel.querySelector('.contentfragment') || tabPanel;
    // Get all direct children except for script/style/noscript
    const tabContentNodes = Array.from(contentFragment.childNodes).filter(
      n => !(n.nodeType === 3 && !n.textContent.trim()) && // skip empty text nodes
           !(n.nodeType === 8) && // skip comments
           !(n.nodeType === 1 && ['SCRIPT','STYLE','NOSCRIPT'].includes(n.nodeName)) // skip script/style/noscript tags
    );
    // If only text node(s), wrap in a <div> for reference
    let content;
    if (tabContentNodes.length === 1 && tabContentNodes[0].nodeType === 1) {
      content = tabContentNodes[0];
    } else if (tabContentNodes.length === 1 && tabContentNodes[0].nodeType === 3) {
      const div = document.createElement('div');
      div.textContent = tabContentNodes[0].textContent;
      content = div;
    } else {
      // If there's a mix, return array for the importer
      content = tabContentNodes;
    }
    return content;
  });

  // The block expects: header, labels row, then a single row with all tab contents as cells
  const cells = [headerRow, labelsRow, contentRow];

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
