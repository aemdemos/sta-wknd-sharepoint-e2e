/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block (the main cmp-tabs element)
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels from the tab list
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabelsEls = Array.from(tabList.querySelectorAll('li'));
  if (!tabLabelsEls.length) return;
  const tabLabels = tabLabelsEls.map(el => el.textContent.trim());

  // Get tab panel elements in order corresponding to the tab labels
  const tabPanels = tabLabelsEls.map((tabEl) => {
    const panelId = tabEl.getAttribute('aria-controls');
    return tabsBlock.querySelector(`#${panelId}`);
  });
  if (tabPanels.length !== tabLabels.length) return;

  // Table header row (single cell)
  const headerRow = ['Tabs (tabs23)'];
  // Tab labels row (one cell per tab)
  const labelRow = tabLabels;

  // Single content row (one cell per tab, content of each tab)
  const contentRow = tabPanels.map(panel => {
    // Get all element children (usually a single .contentfragment, but could be multiple)
    const children = Array.from(panel.childNodes).filter(node => node.nodeType === Node.ELEMENT_NODE);
    if (children.length === 1) {
      return children[0];
    } else if (children.length > 1) {
      return children;
    } else {
      // Only text nodes, wrap in a div
      const div = document.createElement('div');
      div.textContent = panel.textContent;
      return div;
    }
  });

  // Compose table structure: [header], [labels], [all tab contents as columns]
  const cells = [headerRow, labelRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the tabsBlock with the block table
  tabsBlock.replaceWith(block);
}
