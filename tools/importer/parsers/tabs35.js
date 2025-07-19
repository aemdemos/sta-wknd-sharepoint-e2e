/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Extract tab labels
  const tabLabels = Array.from(
    tabsBlock.querySelectorAll('.cmp-tabs__tablist .cmp-tabs__tab')
  ).map(tab => tab.textContent.trim());

  // Extract tab panels (contents)
  const tabPanelEls = tabsBlock.querySelectorAll('.cmp-tabs__tabpanel');

  // Header row first
  const cells = [['Tabs (tabs35)']];

  // Ensure we only iterate as far as we have both labels and panels
  const count = Math.min(tabLabels.length, tabPanelEls.length);
  for (let i = 0; i < count; i++) {
    const label = tabLabels[i];
    const tabPanel = tabPanelEls[i];
    // Find the best content element to represent the tab content
    let content = tabPanel.querySelector('.contentfragment');
    if (!content) {
      // fallback: all non-empty children (text and elements)
      const nodes = Array.from(tabPanel.childNodes).filter(n => {
        if (n.nodeType === Node.TEXT_NODE) return !!n.textContent.trim();
        if (n.nodeType === Node.ELEMENT_NODE) return true;
        return false;
      });
      content = nodes.length === 1 ? nodes[0] : nodes;
    }
    cells.push([label, content]);
  }

  // Create the block table
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the tabs block with the new table
  tabsBlock.replaceWith(blockTable);
}
