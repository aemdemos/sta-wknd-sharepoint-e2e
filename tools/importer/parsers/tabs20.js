/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.tabs .cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels from the tablist (ol > li)
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabelEls = Array.from(tabList.querySelectorAll('[role="tab"]'));
  if (!tabLabelEls.length) return;

  // Get all tabpanel divs (in DOM order)
  const tabPanels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tabpanel'));

  // Header row - single cell, block name exact
  const rows = [
    ['Tabs (tabs20)']
  ];

  // Tab label row - each label in a separate cell, as plain text
  rows.push(tabLabelEls.map(label => label.textContent.trim()));

  // For each tab, make a row: [tab label, tab content]
  for (let i = 0; i < tabLabelEls.length; i++) {
    const label = tabLabelEls[i].textContent.trim();
    const contentPanel = tabPanels[i];
    if (!contentPanel) continue;
    // Gather all direct children of the panel (preserving structure)
    const children = Array.from(contentPanel.childNodes).filter(node => {
      if (node.nodeType === Node.ELEMENT_NODE) return true;
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) return true;
      return false;
    });
    let tabContent;
    if (children.length === 1) {
      tabContent = children[0];
    } else if (children.length > 1) {
      tabContent = children;
    } else {
      tabContent = '';
    }
    rows.push([label, tabContent]);
  }

  // Create the table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original tabs block with the table
  tabsBlock.replaceWith(table);
}
