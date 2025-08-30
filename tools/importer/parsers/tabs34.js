/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get the tab labels from the tablist
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('[role="tab"]'));

  // Get all tab panels (tab contents)
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Header row: single cell
  const cells = [['Tabs (tabs34)']];

  // Each tab: two cells [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    const tabId = tabLabels[i].id;
    const panel = tabPanels.find(p => p.getAttribute('aria-labelledby') === tabId);
    if (!panel) continue;

    // Extract main content for the tab panel
    let tabContentElements = [];
    const contentFragment = panel.querySelector('.contentfragment, .cmp-contentfragment');
    if (contentFragment) {
      const cfElements = contentFragment.querySelector('.cmp-contentfragment__elements');
      if (cfElements) {
        // Only collect actual content, skip empty grids
        Array.from(cfElements.childNodes).forEach(node => {
          if (node.nodeType === 1) {
            // Exclude empty grid wrappers
            if (
              node.classList.contains('aem-Grid') &&
              node.querySelectorAll(':scope > *:not(.aem-GridColumn)').length === 0
            ) {
              return;
            }
            tabContentElements.push(node);
          } else if (node.nodeType === 3 && node.textContent.trim()) {
            tabContentElements.push(document.createTextNode(node.textContent));
          }
        });
      }
    }
    // Fallback: if nothing found, use all child nodes of panel
    if (tabContentElements.length === 0) {
      tabContentElements = Array.from(panel.childNodes).filter(n => (n.nodeType !== 3 || n.textContent.trim()));
    }
    // Only keep content that is not an empty grid container
    tabContentElements = tabContentElements.filter(node => {
      if (node.nodeType === 1 && node.classList.contains('aem-Grid')) {
        // check for visible children
        return node.querySelectorAll(':scope > *:not(.aem-GridColumn)').length > 0;
      }
      return true;
    });
    // Add this tab as a row with two cells: [label, content]
    cells.push([label, tabContentElements]);
  }

  // Create the table and replace the element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
