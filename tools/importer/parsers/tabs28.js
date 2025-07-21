/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block (by .cmp-tabs)
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get all tab labels in order
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  const tabLabels = [];
  if (tabList) {
    tabList.querySelectorAll('li[role="tab"]').forEach(li => {
      tabLabels.push(li.textContent.trim());
    });
  }

  // Get all tab panels in order
  const tabPanels = tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]');

  // Start table rows
  const rows = [];
  // Exact table header as block name
  rows.push(['Tabs (tabs28)']);

  // For each tab, add a row with [label, content]
  tabPanels.forEach((panel, i) => {
    // Find the label (may be missing if tabs/labels out of sync)
    const label = tabLabels[i] || '';
    // Get all the direct children of the relevant content fragment's elements section
    let tabContent = [];
    // Most panels are like: <div .cmp-tabs__tabpanel><div .contentfragment><article><div .cmp-contentfragment__elements>...</div></article></div></div>
    // We want to get everything inside .cmp-contentfragment__elements
    const cfElements = panel.querySelector('.cmp-contentfragment__elements');
    if (cfElements) {
      // Gather all child nodes that are not empty whitespace text nodes
      tabContent = Array.from(cfElements.childNodes).filter(node => {
        if (node.nodeType === Node.TEXT_NODE) {
          return node.textContent.trim() !== '';
        }
        // Also skip empty .aem-Grid containers
        if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains('aem-Grid') && !node.textContent.trim()) {
          return false;
        }
        // Remove divs that only have empty grid children
        if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'DIV' && node.childElementCount > 0) {
          const onlyGrids = Array.from(node.children).every(child => child.classList.contains('aem-Grid') && !child.textContent.trim());
          if (onlyGrids) return false;
        }
        return true;
      });
    } else {
      // Fallback: get all children of panel that are not whitespace
      tabContent = Array.from(panel.childNodes).filter(node => {
        return !(node.nodeType === Node.TEXT_NODE && !node.textContent.trim());
      });
    }
    // If for some reason nothing was found, fallback to the full panel
    if (tabContent.length === 0) tabContent = [panel];
    // Add the row to the table
    rows.push([label, tabContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  tabsBlock.replaceWith(block);
}
