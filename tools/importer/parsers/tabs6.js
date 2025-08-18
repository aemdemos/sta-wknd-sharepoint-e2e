/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the cmp-tabs block
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels from tablist
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  const tabLabels = [];
  if (tabList) {
    tabList.querySelectorAll('li[role="tab"]').forEach(tab => {
      tabLabels.push(tab.textContent.trim());
    });
  }

  // Get all tab panels (must match tabLabels order)
  const tabPanels = tabsBlock.querySelectorAll('.cmp-tabs__tabpanel');
  const tabContents = [];
  tabPanels.forEach(panel => {
    // Look for article.cmp-contentfragment inside this panel
    const contentFragment = panel.querySelector('article.cmp-contentfragment');
    if (contentFragment) {
      // Try to find the main .cmp-contentfragment__elements block
      const cfElements = contentFragment.querySelector('.cmp-contentfragment__elements');
      if (cfElements) {
        // Filter out empty grid wrappers directly under cfElements
        const meaningful = Array.from(cfElements.children).filter(child => {
          // Exclude empty grid divs (contain only aem-Grid and whitespace)
          if (
            child.matches('div') &&
            child.querySelector('.aem-Grid') &&
            child.textContent.trim() === ''
          ) {
            return false;
          }
          return true;
        });
        // If only one meaningful child, use that; else, use the array
        tabContents.push(meaningful.length === 1 ? meaningful[0] : meaningful);
      } else {
        tabContents.push(contentFragment);
      }
    } else {
      // Fallback: use panel children, filtering empty grid wrappers
      const meaningful = Array.from(panel.children).filter(child => {
        if (
          child.matches('div') &&
          child.querySelector('.aem-Grid') &&
          child.textContent.trim() === ''
        ) {
          return false;
        }
        return true;
      });
      tabContents.push(meaningful.length === 1 ? meaningful[0] : meaningful);
    }
  });

  // Build block table: header, then each tab (label, content)
  const cells = [["Tabs (tabs6)"]];
  for (let i = 0; i < tabLabels.length; i++) {
    const content = tabContents[i] !== undefined ? tabContents[i] : '';
    cells.push([tabLabels[i], content]);
  }

  // Create and replace the block
  const table = WebImporter.DOMUtils.createTable(cells, document);
  tabsBlock.parentNode.replaceChild(table, tabsBlock);
}