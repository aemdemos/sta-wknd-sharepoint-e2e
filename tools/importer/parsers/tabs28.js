/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the tabs block in the element
  const tabsContainer = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  if (!tabsContainer) return;

  // Find the cmp-tabs element (contains tablist and tabpanels)
  const cmpTabs = tabsContainer.querySelector('.cmp-tabs') || tabsContainer;
  if (!cmpTabs) return;

  // Get tab labels from the tablist
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('.cmp-tabs__tab')).map(tab => tab.textContent.trim());

  // Get tab panels (content for each tab)
  const tabPanels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tabpanel'));

  // Build table rows
  const headerRow = ['Tabs (tabs28)'];
  const rows = [headerRow];

  // Each tab: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    if (!panel) continue;

    // Defensive: Find the main contentfragment/article inside each tabpanel
    let tabContent = null;
    const contentFragment = panel.querySelector('.cmp-contentfragment');
    if (contentFragment) {
      // Use the contentfragment's inner elements (excluding the title)
      const title = contentFragment.querySelector('.cmp-contentfragment__title');
      // Get all direct children of .cmp-contentfragment__elements
      const elementsContainer = contentFragment.querySelector('.cmp-contentfragment__elements');
      if (elementsContainer) {
        // Collect all direct children except empty grid wrappers
        const contentNodes = Array.from(elementsContainer.childNodes)
          .filter(node => {
            // Filter out empty grid wrappers and whitespace
            if (node.nodeType === Node.ELEMENT_NODE) {
              if (node.classList.contains('aem-Grid')) return false;
              if (node.classList.contains('aem-GridColumn')) return false;
              if (node.classList.contains('image')) return true;
              return true;
            } else if (node.nodeType === Node.TEXT_NODE) {
              return node.textContent.trim().length > 0;
            }
            return false;
          });
        // If there's a title, prepend it
        if (title) {
          contentNodes.unshift(title);
        }
        tabContent = contentNodes;
      } else {
        // Fallback: use the whole contentfragment
        tabContent = [contentFragment];
      }
    } else {
      // Fallback: use the whole panel
      tabContent = [panel];
    }

    rows.push([label, tabContent]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabs block with the table
  tabsContainer.replaceWith(table);
}
