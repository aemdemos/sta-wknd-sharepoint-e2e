/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block element
  const tabsBlock = element.querySelector('.tabs .cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels and tabpanel IDs from the tablist
  const tabLabels = [];
  const tabIds = [];
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  if (tabList) {
    tabList.querySelectorAll('li[role=tab]').forEach(li => {
      tabLabels.push(li.textContent.trim());
      const ariaControls = li.getAttribute('aria-controls');
      tabIds.push(ariaControls);
    });
  }

  // For each tab, get the corresponding tabpanel content
  const rows = [['Tabs (tabs12)']];
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const tabpanelId = tabIds[i];
    const tabpanel = tabsBlock.querySelector(`#${tabpanelId}`);

    // Try to get the main content area of the tabpanel
    let content = null;
    if (tabpanel) {
      // Find the first contentfragment/article direct child
      let mainContent = null;
      // Try various selectors for resiliency
      mainContent = tabpanel.querySelector(':scope > .contentfragment, :scope > .cmp-contentfragment, :scope > article, :scope > .cmp-contentfragment__elements');
      if (!mainContent) {
        // fallback: if the tabpanel has only one child node, use it; otherwise, use the tabpanel itself
        const children = Array.from(tabpanel.childNodes).filter(n => n.nodeType === 1);
        if (children.length === 1) {
          mainContent = children[0];
        }
      }
      content = mainContent || tabpanel;
    }
    rows.push([label, content]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace original tabs block with the new table
  tabsBlock.replaceWith(table);
}
