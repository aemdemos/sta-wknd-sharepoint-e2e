/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get tab label and content from a cmp-tabs block
  function extractTabsData(tabsRoot) {
    const tabs = [];
    // Get all tab labels (li elements)
    const tabLabels = Array.from(tabsRoot.querySelectorAll('.cmp-tabs__tablist > li'));
    // Get all tab panels (divs with role="tabpanel")
    const tabPanels = Array.from(tabsRoot.querySelectorAll('[role="tabpanel"]'));
    // Defensive: ensure same number of labels and panels
    for (let i = 0; i < tabLabels.length; i++) {
      const label = tabLabels[i].textContent.trim();
      const panel = tabPanels[i];
      // Defensive: if panel missing, skip
      if (!panel) continue;
      // Tab content: grab the main contentfragment/article inside the panel
      // Use the article element if present, otherwise the whole panel
      let tabContent = panel.querySelector('article') || panel;
      tabs.push([label, tabContent]);
    }
    return tabs;
  }

  // Find the tabs block in the element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return; // Defensive: nothing to do

  // Compose table rows
  const headerRow = ['Tabs (tabs13)'];
  const rows = [headerRow];
  const tabsData = extractTabsData(tabsBlock);
  tabsData.forEach(([label, content]) => {
    rows.push([label, content]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
