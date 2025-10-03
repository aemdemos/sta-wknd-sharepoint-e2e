/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get immediate child tab panels and their labels
  function getTabsAndPanels(tabsRoot) {
    const tabLabels = [];
    const tabPanels = [];
    // Find tab labels
    const tabList = tabsRoot.querySelector('.cmp-tabs__tablist');
    if (tabList) {
      tabList.querySelectorAll('li[role="tab"]').forEach(tab => {
        tabLabels.push(tab.textContent.trim());
      });
    }
    // Find tab panels
    tabsRoot.querySelectorAll('[role="tabpanel"]').forEach(panel => {
      tabPanels.push(panel);
    });
    return { tabLabels, tabPanels };
  }

  // Find the tabs block inside the provided element
  const tabsBlock = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  let tabsRoot;
  if (tabsBlock && tabsBlock.classList.contains('cmp-tabs')) {
    tabsRoot = tabsBlock;
  } else if (tabsBlock) {
    tabsRoot = tabsBlock.querySelector('.cmp-tabs');
  }
  if (!tabsRoot) return;

  // Get tab labels and panels
  const { tabLabels, tabPanels } = getTabsAndPanels(tabsRoot);

  // Compose table rows
  const cells = [];
  // Header row
  const headerRow = ['Tabs (tabs3)'];
  cells.push(headerRow);

  // For each tab, add a row: [label, content]
  tabLabels.forEach((label, i) => {
    const panel = tabPanels[i];
    if (!panel) return;
    // Defensive: find the main content fragment/article inside the panel
    let tabContent = null;
    // Usually a contentfragment/article
    tabContent = panel.querySelector('article') || panel;
    // For robustness, clone the content so it doesn't get removed from DOM
    let tabContentElem = tabContent.cloneNode(true);
    // Remove any tab title repetition (h3) inside tab content fragment
    const h3 = tabContentElem.querySelector('h3.cmp-contentfragment__title');
    if (h3) h3.remove();
    // Remove empty grid wrappers
    tabContentElem.querySelectorAll('.aem-Grid').forEach(grid => {
      if (!grid.textContent.trim() && !grid.querySelector('img')) grid.remove();
    });
    // Remove empty divs
    tabContentElem.querySelectorAll('div').forEach(div => {
      if (!div.textContent.trim() && !div.querySelector('img') && !div.querySelector('ul')) div.remove();
    });
    cells.push([label, tabContentElem]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the tabs block with the new table
  tabsBlock.parentNode.replaceChild(block, tabsBlock);
}
