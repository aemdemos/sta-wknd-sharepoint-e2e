/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get immediate children by selector
  function getImmediateChildren(parent, selector) {
    return Array.from(parent.children).filter((el) => el.matches(selector));
  }

  // Find the tabs block
  const tabsBlock = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  if (!tabsBlock) return;

  // Find the tablist (labels)
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('li[role="tab"]'));

  // Find all tabpanels (content)
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[role="tabpanel"]'));

  // Defensive: ensure same number of labels and panels
  if (tabLabels.length !== tabPanels.length) return;

  // Header row
  const headerRow = ['Tabs (tabs18)'];

  // Build rows for each tab
  const rows = tabLabels.map((tabLabel, idx) => {
    // Tab label text
    const labelText = tabLabel.textContent.trim();

    // Tab content: get the corresponding tabpanel
    const tabPanel = tabPanels[idx];

    // Defensive: if no tabPanel, skip
    if (!tabPanel) return null;

    // For tab content, grab the main contentfragment/article inside
    let tabContent = null;
    const contentFragment = tabPanel.querySelector('article.cmp-contentfragment');
    if (contentFragment) {
      // For the Overview tab, include image and description
      // For others, include the contentfragment's main content
      // We'll grab the .cmp-contentfragment__elements div
      const elementsDiv = contentFragment.querySelector('.cmp-contentfragment__elements');
      if (elementsDiv) {
        tabContent = elementsDiv;
      } else {
        tabContent = contentFragment;
      }
    } else {
      // If no contentfragment, fallback to tabPanel's children
      tabContent = tabPanel;
    }

    return [labelText, tabContent];
  }).filter(Boolean);

  // Compose table cells
  const cells = [headerRow, ...rows];

  // Create table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original tabs block with the new block table
  tabsBlock.replaceWith(block);
}
