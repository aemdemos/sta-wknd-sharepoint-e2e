/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get all tab labels and tab contents from the cmp-tabs block
  function getTabsData(tabsEl) {
    const tabLabels = [];
    const tabContents = [];

    // Find tab labels (li elements inside ol[role=tablist])
    const tabList = tabsEl.querySelector('ol[role="tablist"]');
    if (tabList) {
      tabList.querySelectorAll('li[role="tab"]').forEach(li => {
        tabLabels.push(li.textContent.trim());
      });
    }

    // Find tab panels (div[role=tabpanel])
    const tabPanels = tabsEl.querySelectorAll('div[role="tabpanel"]');
    tabPanels.forEach(panel => {
      // Defensive: grab the main contentfragment/article inside the panel
      let content = null;
      // Try to find the contentfragment/article
      const cf = panel.querySelector('article.cmp-contentfragment');
      if (cf) {
        // Use the entire article as the tab content
        content = cf;
      } else {
        // Fallback: use the panel itself
        content = panel;
      }
      tabContents.push(content);
    });

    return { tabLabels, tabContents };
  }

  // Find the tabs block inside the element
  const tabsBlock = element.querySelector('.tabs.panelcontainer .cmp-tabs');
  if (!tabsBlock) {
    // No tabs block found, do nothing
    return;
  }

  // Get tab labels and contents
  const { tabLabels, tabContents } = getTabsData(tabsBlock);

  // Build the table rows
  const headerRow = ['Tabs (tabs23)'];
  const rows = [headerRow];

  // Each tab: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    // Defensive: ensure tabContents[i] exists
    if (tabContents[i]) {
      rows.push([
        tabLabels[i],
        tabContents[i]
      ]);
    }
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
