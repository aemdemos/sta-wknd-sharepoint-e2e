/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get all tab labels from the tablist
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  const tabLabels = tabList
    ? Array.from(tabList.querySelectorAll('[role="tab"]')).map(tab => tab.textContent.trim())
    : [];

  // Get all tab panels corresponding to each tab label
  const tabPanels = tabLabels.map(label => {
    // Find the li[role=tab] with this label
    const tabs = Array.from(tabList.querySelectorAll('[role="tab"]'));
    const tab = tabs.find(t => t.textContent.trim() === label);
    if (!tab) return null;
    // Get aria-controls, which matches panel id
    const panelId = tab.getAttribute('aria-controls');
    if (!panelId) return null;
    const panel = tabsBlock.querySelector('#' + panelId);
    return panel || null;
  });

  // Compose the header row: block name (from instructions)
  const headerRow = ['Tabs (tabs12)'];

  // Compose the tab label row: each tab label
  const tabLabelRow = tabLabels;

  // Compose the tab content row: each cell is the corresponding tab panel's main content
  // For resilience, reference the whole tabpanel's main contentfragment/article if present (otherwise, panel itself)
  const tabContentRow = tabPanels.map(panel => {
    if (!panel) return '';
    // Find the main contentfragment/article inside the panel
    const cf = panel.querySelector('article');
    return cf ? cf : panel;
  });

  // Compose the table: header, label row, content row
  const cells = [
    headerRow,
    tabLabelRow,
    tabContentRow
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace only the tabs block with the table
  tabsBlock.parentNode.replaceChild(block, tabsBlock);
}
