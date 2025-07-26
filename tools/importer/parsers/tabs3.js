/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs element which is the root of the tabs block
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Find the tab labels
  const tabList = tabsRoot.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabelsEls = Array.from(tabList.querySelectorAll('li'));

  // Find all tabpanel elements (tabpanel role and cmp hook)
  const tabPanels = Array.from(tabsRoot.querySelectorAll('[role="tabpanel"][data-cmp-hook-tabs="tabpanel"]'));

  // Header as in the specification
  const rows = [['Tabs (tabs3)']];

  // For each tab, get its label and content
  for (let i = 0; i < tabLabelsEls.length; i++) {
    const tabLabel = tabLabelsEls[i]?.textContent?.trim() || '';
    // Match the correct tabpanel by comparing aria-labelledby to the tab id
    const tabId = tabLabelsEls[i]?.id;
    let panel = tabPanels.find(p => p.getAttribute('aria-labelledby') === tabId);
    if (!panel) {
      // fallback by index if not found
      panel = tabPanels[i];
    }
    // Extract all content from this panel's children except empty grid wrappers
    // Some content is wrapped in <div class="contentfragment">, but we want the actual content
    // We'll grab all child nodes and filter out empty grid wrappers
    let contentNodes = [];
    if (panel) {
      // If the panel has one child and it's a .contentfragment, dig into it
      if (panel.children.length === 1 && panel.firstElementChild.classList.contains('contentfragment')) {
        const cf = panel.firstElementChild;
        // Use all children of the contentfragment
        contentNodes = Array.from(cf.childNodes).filter(n => {
          // Remove empty grid wrappers
          if (n.nodeType === 1 && n.matches('.aem-Grid, .aem-Grid--12')) {
            return n.textContent.trim() !== '';
          }
          if (n.nodeType === 3) {
            return n.textContent.trim() !== '';
          }
          return true;
        });
      } else {
        contentNodes = Array.from(panel.childNodes).filter(n => {
          if (n.nodeType === 1 && n.matches('.aem-Grid, .aem-Grid--12')) {
            return n.textContent.trim() !== '';
          }
          if (n.nodeType === 3) {
            return n.textContent.trim() !== '';
          }
          return true;
        });
      }
    }
    // If all nodes are empty divs, fallback to empty string
    let content;
    if (contentNodes.length === 1) {
      content = contentNodes[0];
    } else if (contentNodes.length > 1) {
      content = contentNodes;
    } else {
      content = '';
    }
    rows.push([tabLabel, content]);
  }
  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  tabsRoot.replaceWith(table);
}
