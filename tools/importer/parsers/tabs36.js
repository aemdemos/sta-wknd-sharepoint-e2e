/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block (look for .cmp-tabs)
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get the tab label elements (li)
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  const tabLis = tabList ? Array.from(tabList.children) : [];

  // Get all tabpanel elements for the tabs
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[role="tabpanel"]'));

  // Prepare the header row as per instructions
  const headerRow = ['Tabs (tabs36)'];
  
  // Build rows for each tab: [Tab Label, Tab Content]
  const rows = [];

  // Pair up each label with its tabpanel using aria-controls and id
  tabLis.forEach((li, idx) => {
    const tabLabel = li.textContent.trim();
    let panel = null;
    const controls = li.getAttribute('aria-controls');
    if (controls) {
      panel = tabPanels.find(tp => tp.id === controls);
    }
    if (!panel) {
      // fallback to index matching if aria-controls is missing or mismatched
      panel = tabPanels[idx];
    }
    // Defensive: if no panel, use empty content
    let tabContent = '';
    if (panel) {
      // Find the main content container inside the panel
      // Prefer article, fallback to div.contentfragment, fallback to panel itself
      tabContent = panel.querySelector('article') || panel.querySelector('div.contentfragment') || panel;
    }
    rows.push([tabLabel, tabContent]);
  });

  // Compose the final table: header, [tab label, tab content] for each tab
  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}