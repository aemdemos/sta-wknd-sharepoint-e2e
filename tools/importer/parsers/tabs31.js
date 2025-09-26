/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs block
  const tabsBlock = element.querySelector('.tabs .cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('li'));

  // Get all tab panels (content)
  const tabPanels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tabpanel'));

  // Defensive: ensure same number of tabs and panels
  if (tabLabels.length !== tabPanels.length) return;

  // Table header row as required
  const headerRow = ['Tabs (tabs31)'];
  const rows = [headerRow];

  // For each tab, extract label and content
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];

    // Defensive: skip if no panel
    if (!panel) continue;

    // For content, grab everything inside the tabpanel
    // We'll use the direct children of the tabpanel's contentfragment/article
    let contentFragment = panel.querySelector('article.cmp-contentfragment');
    let tabContentNodes = [];
    if (contentFragment) {
      // Try to find the main content area inside the contentfragment
      // Usually it's inside a .cmp-contentfragment__elements div
      let mainContent = contentFragment.querySelector('.cmp-contentfragment__elements');
      if (mainContent) {
        // We'll collect all direct children except empty grid wrappers
        tabContentNodes = Array.from(mainContent.childNodes).filter((n) => {
          // Remove empty text nodes and empty grid wrappers
          if (n.nodeType === Node.TEXT_NODE && !n.textContent.trim()) return false;
          if (n.nodeType === Node.ELEMENT_NODE) {
            // Remove empty .aem-Grid wrappers
            if (n.classList && n.classList.contains('aem-Grid')) return false;
            // Remove empty wrappers
            if (n.childElementCount === 0 && !n.textContent.trim()) return false;
          }
          return true;
        });
      } else {
        // Fallback: use all children of contentFragment
        tabContentNodes = Array.from(contentFragment.childNodes).filter((n) => {
          if (n.nodeType === Node.TEXT_NODE && !n.textContent.trim()) return false;
          return true;
        });
      }
    } else {
      // Fallback: use all children of panel
      tabContentNodes = Array.from(panel.childNodes).filter((n) => {
        if (n.nodeType === Node.TEXT_NODE && !n.textContent.trim()) return false;
        return true;
      });
    }

    // Defensive: if nothing found, fallback to panel innerHTML
    let tabContent;
    if (tabContentNodes.length === 1) {
      tabContent = tabContentNodes[0];
    } else if (tabContentNodes.length > 1) {
      tabContent = tabContentNodes;
    } else {
      tabContent = panel.innerHTML;
    }

    rows.push([label, tabContent]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original tabs block with the table
  tabsBlock.replaceWith(table);
}
