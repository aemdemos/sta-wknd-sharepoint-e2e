/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root
  const tabsBlock = element.querySelector('.tabs.panelcontainer');
  if (!tabsBlock) return;

  // Find the cmp-tabs element
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels from the tablist
  const tabLabels = [];
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  if (tabList) {
    tabList.querySelectorAll('.cmp-tabs__tab').forEach(tab => {
      tabLabels.push(tab.textContent.trim());
    });
  }

  // Get tab panels (content)
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Compose table rows
  const headerRow = ['Tabs (tabs6)'];
  const rows = [headerRow];

  // Defensive: Only pair as many panels as there are labels
  for (let i = 0; i < Math.min(tabLabels.length, tabPanels.length); i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];

    // Extract the content inside the tab panel
    // We'll grab everything inside the tabpanel (usually a contentfragment)
    // Defensive: If there's a .contentfragment, use its children
    let contentElem = null;
    const cf = panel.querySelector('.contentfragment');
    if (cf) {
      // Remove the title h3 if present (to avoid repetition)
      const cfClone = cf.cloneNode(true);
      const h3 = cfClone.querySelector('h3');
      if (h3) h3.remove();
      // Remove empty grid wrappers
      cfClone.querySelectorAll('.aem-Grid, .aem-Grid--12, .aem-Grid--default--12').forEach(e => {
        if (e.children.length === 0) e.remove();
      });
      contentElem = cfClone;
    } else {
      // Fallback: use the panel itself
      contentElem = panel.cloneNode(true);
    }

    rows.push([label, contentElem]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabs block with the table
  tabsBlock.replaceWith(table);
}
