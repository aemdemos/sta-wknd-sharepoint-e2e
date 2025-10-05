/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract tab label and content from a tabs block
  function getTabsData(tabsRoot) {
    const tabLabels = [];
    const tabContents = [];
    // Get tab labels from <ol> (role=tablist)
    const tablist = tabsRoot.querySelector('ol[role="tablist"]');
    if (tablist) {
      tabLabels.push(...Array.from(tablist.children).map(li => li.textContent.trim()));
    }
    // Get tab panels (role=tabpanel)
    const tabPanels = Array.from(tabsRoot.querySelectorAll('div[role="tabpanel"]'));
    tabPanels.forEach(panel => {
      // Defensive: get the main contentfragment/article inside each tabpanel
      let content = null;
      // Prefer the contentfragment/article if present
      content = panel.querySelector('article') || panel;
      tabContents.push(content);
    });
    return { tabLabels, tabContents };
  }

  // Find the tabs block in the element
  const tabsBlock = element.querySelector('.tabs .cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels and contents
  const { tabLabels, tabContents } = getTabsData(tabsBlock);

  // Table header row
  const headerRow = ['Tabs (tabs25)'];
  const rows = [headerRow];

  // Each tab: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    // Defensive: if content is missing, use empty div
    let tabContent = tabContents[i] || document.createElement('div');
    rows.push([tabLabels[i], tabContent]);
  }

  // Create table block
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block
  element.replaceWith(block);
}
