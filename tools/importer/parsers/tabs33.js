/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  const tabLabels = [];
  if (tabList) {
    tabList.querySelectorAll('[role="tab"]').forEach(tab => {
      tabLabels.push(tab.textContent.trim());
    });
  }

  // Get tab panels in order
  const tabPanels = tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]');
  const tabContents = [];
  tabPanels.forEach(tabPanel => {
    // Find the main contentfragment/article for this tab
    const contentFragment = tabPanel.querySelector('article.cmp-contentfragment');
    let contentCells = [];
    if (contentFragment) {
      // Find the .cmp-contentfragment__elements wrapper, which contains the actual tab content
      const elements = contentFragment.querySelector('.cmp-contentfragment__elements');
      if (elements) {
        // Collect meaningful children, skipping empty grid divs
        elements.childNodes.forEach(node => {
          if (node.nodeType === 1) {
            if (node.classList.contains('aem-Grid') || node.classList.contains('aem-GridColumn')) {
              // Skip empty grid wrappers (unless they contain images, headings, lists, paragraphs)
              if (node.querySelector('img, h2, h3, p, ul, li, .cmp-image')) {
                contentCells.push(node);
              }
            } else {
              contentCells.push(node);
            }
          } else if (node.nodeType === 3 && node.textContent.trim()) {
            contentCells.push(node);
          }
        });
      }
      // If no valid children, fallback to the contentfragment itself
      if (contentCells.length === 0) {
        contentCells = [contentFragment];
      }
    } else {
      // Fallback: use tabPanel's content
      contentCells = [tabPanel];
    }
    tabContents.push(contentCells);
  });

  // Table header: match example exactly
  const headerRow = ['Tabs (tabs33)'];
  // Compose cells: first row is header, then each tab row with [label, content]
  const cells = [headerRow];
  tabLabels.forEach((label, i) => {
    cells.push([
      label,
      tabContents[i]
    ]);
  });

  // Create and replace the block
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
