/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the main tabs block
  const tabsBlock = element.querySelector('.tabs .cmp-tabs');
  if (!tabsBlock) return;

  // Extract the tab labels
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  const tabLabels = [];
  if (tabList) {
    tabList.querySelectorAll('li[role="tab"]').forEach(tab => {
      tabLabels.push(tab.textContent.trim());
    });
  }

  // Extract the tab content panels, in DOM order
  const tabPanels = Array.from(
    tabsBlock.querySelectorAll('[role="tabpanel"][data-cmp-hook-tabs="tabpanel"]')
  );
  const tabContents = tabPanels.map((tabPanel) => {
    // Look for the main content block inside the tabpanel: prefer <article.cmp-contentfragment>, fallback to tabPanel
    let mainContent = null;
    for (const node of tabPanel.children) {
      if (
        node.nodeType === Node.ELEMENT_NODE &&
        (node.classList.contains('contentfragment') || node.classList.contains('cmp-contentfragment'))
      ) {
        mainContent = node;
        break;
      }
    }
    // fallback: use tabPanel itself
    return mainContent || tabPanel;
  });

  // Build table structure
  const rows = [];
  rows.push(['Tabs (tabs3)']);
  for (let i = 0; i < tabLabels.length; i += 1) {
    rows.push([tabLabels[i], tabContents[i]]);
  }

  // Create and replace block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  tabsBlock.replaceWith(table);
}
