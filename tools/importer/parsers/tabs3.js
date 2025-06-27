/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block (this element should be the .tabs container)
  let tabsBlock = element;
  if (!tabsBlock.classList.contains('tabs')) {
    tabsBlock = element.querySelector('.tabs');
  }
  if (!tabsBlock) return;

  // Find the cmp-tabs within the tabs block
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get the tab labels from the tablist
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  const tabLabels = [];
  if (tabList) {
    tabList.querySelectorAll('li[role="tab"]').forEach(tab => {
      tabLabels.push(tab.textContent.trim());
    });
  }

  // Find the tab panels in order
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));
  
  // Build table rows, starting with the header
  // Header row matches exactly: Tabs (tabs3)
  const headerRow = ['Tabs (tabs3)'];
  const rows = [headerRow];

  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i] || '';
    let contentCell = '';
    if (tabPanels[i]) {
      // Use all direct children of the tabpanel for robustness
      const children = Array.from(tabPanels[i].children).filter((child) => {
        // Remove empty grid wrappers/divs that serve no content
        if (child.children && child.children.length === 1 && child.firstElementChild && child.firstElementChild.classList.contains('aem-Grid')) {
          // skip wrappers
          return false;
        }
        return true;
      });
      if (children.length === 1) {
        contentCell = children[0];
      } else if (children.length > 1) {
        contentCell = children;
      } else {
        // fallback to the tabPanel itself
        contentCell = tabPanels[i];
      }
    }
    rows.push([label, contentCell]);
  }

  // Create and replace with the new block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  tabsBlock.replaceWith(table);
}
