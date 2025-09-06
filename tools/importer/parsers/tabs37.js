/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  if (!tabsBlock) return;

  // Find tab labels
  const tabList = tabsBlock.querySelector('ol[role="tablist"]');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('li[role="tab"]'));

  // Find tab panels
  const tabPanels = Array.from(tabsBlock.querySelectorAll('div[role="tabpanel"]'));
  if (tabLabels.length !== tabPanels.length || tabLabels.length === 0) return;

  // Table header row (must match block name exactly)
  const headerRow = ['Tabs (tabs37)'];
  const rows = [headerRow];

  // For each tab, create a row: [Tab Label, Tab Content]
  tabLabels.forEach((tabLabel, idx) => {
    const labelText = tabLabel.textContent.trim();
    const tabPanel = tabPanels[idx];
    if (!tabPanel) return;

    // Extract the main content for the tab (preserve all HTML, images, lists, etc)
    // Use the .contentfragment > article if present, else all children
    let tabContent = null;
    const contentFragment = tabPanel.querySelector('.contentfragment > article');
    if (contentFragment) {
      tabContent = contentFragment;
    } else {
      // fallback: wrap all tabPanel children in a div
      tabContent = document.createElement('div');
      Array.from(tabPanel.childNodes).forEach(node => tabContent.appendChild(node.cloneNode(true)));
    }
    rows.push([labelText, tabContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  tabsBlock.replaceWith(block);
}
