/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block in the element
  let tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) {
    // Try aem tabs wrapper
    tabsBlock = element.querySelector('.tabs.panelcontainer');
    if (tabsBlock) {
      tabsBlock = tabsBlock.querySelector('.cmp-tabs') || tabsBlock;
    }
  }
  if (!tabsBlock) return;

  // Get tab labels
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('li'));
  // Get tabpanels
  const tabPanels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tabpanel'));

  // Header row matches example exactly
  const cells = [['Tabs (tabs38)']];

  // Loop through the tabs in order and add [label, content-block]
  tabLabels.forEach((tabLabel, i) => {
    const label = tabLabel.textContent.trim();
    // Try to match panel by aria-controls, fallback to order
    const ariaControls = tabLabel.getAttribute('aria-controls');
    let panel = tabPanels.find(p => p.id === ariaControls);
    if (!panel) panel = tabPanels[i];

    let tabContent;
    // Prefer contentfragment > article for semantic block, otherwise fallback to panel
    const contentFragment = panel ? panel.querySelector('.contentfragment') : null;
    if (contentFragment) {
      const article = contentFragment.querySelector('article');
      tabContent = article ? article : contentFragment;
    } else if (panel) {
      tabContent = panel;
    } else {
      tabContent = document.createTextNode('');
    }
    // Reference the element directly
    cells.push([label, tabContent]);
  });

  // Replace the element with the block table
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(blockTable);
}
