/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the tabs block within the section
  const tabsBlock = element.querySelector('.tabs.panelcontainer');
  if (!tabsBlock) return;
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get all tab labels from the tab list
  const tabLabels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get all tab panel elements
  const tabPanels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tabpanel'));

  // Header row matches the example: single column with block name
  const headerRow = ['Tabs (tabs6)'];
  // Each subsequent row: [tab label, tab content]
  const rows = tabLabels.map((tabLabel, i) => {
    const label = tabLabel.textContent.trim();
    const panel = tabPanels[i];
    let tabContent = [];
    if (panel) {
      // The tab panel wraps a .contentfragment article for each tab
      const contentFrag = panel.querySelector('.contentfragment');
      if (contentFrag) {
        // Reference all children, not clone
        tabContent = Array.from(contentFrag.children);
      } else {
        // Fallback: reference all direct children
        tabContent = Array.from(panel.children).filter(el => el.nodeType === 1 && el.tagName !== 'SCRIPT' && el.tagName !== 'STYLE');
      }
    }
    // Single element or array as needed
    const tabContentCell = tabContent.length === 1 ? tabContent[0] : tabContent;
    return [label, tabContentCell];
  });

  // Final cells array: header + all tab rows
  const cells = [headerRow, ...rows];
  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace original tabs block with new block table
  tabsBlock.replaceWith(block);
}
