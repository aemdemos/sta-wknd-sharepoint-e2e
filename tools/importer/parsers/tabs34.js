/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  if (!tabsBlock) return;

  // Find the cmp-tabs element (may be nested)
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs') || tabsBlock;

  // Get tab labels (li elements)
  const tabLabels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tablist > li'));

  // Get tab panels (divs with role="tabpanel")
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[role="tabpanel"]'));

  // Defensive: ensure labels and panels match
  if (tabLabels.length === 0 || tabPanels.length === 0 || tabLabels.length !== tabPanels.length) return;

  // Table header row
  const headerRow = ['Tabs (tabs34)'];
  const rows = [headerRow];

  // For each tab, add [label, content] row
  for (let i = 0; i < tabLabels.length; i++) {
    const labelText = tabLabels[i].textContent.trim();
    // Defensive: get the contentfragment/article inside the tabpanel
    let tabContent = tabPanels[i].querySelector('.contentfragment, article');
    if (!tabContent) {
      // fallback: use all children of tabPanels[i]
      tabContent = document.createElement('div');
      Array.from(tabPanels[i].childNodes).forEach(node => tabContent.appendChild(node.cloneNode(true)));
    }
    rows.push([labelText, tabContent]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabsBlock with the new block table
  tabsBlock.replaceWith(block);
}
