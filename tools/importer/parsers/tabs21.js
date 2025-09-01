/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the tabs block
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Extract tab labels from the tablist
  const tabLabels = Array.from(
    tabsBlock.querySelectorAll('.cmp-tabs__tablist [role="tab"]')
  );

  // Extract tab panels
  const tabPanels = Array.from(
    tabsBlock.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Build the header row
  const headerRow = ['Tabs (tabs21)'];

  // Each subsequent row represents a tab: [label, content]
  const tabRows = tabLabels.map((tab, i) => {
    const label = tab.textContent.trim();
    // Try to find the corresponding panel by index
    const panel = tabPanels[i];
    let contentCell;
    if (panel) {
      // For semantic preservation and robustness, reference all children of the tabpanel
      // that are not empty text nodes
      const children = Array.from(panel.childNodes).filter(node => {
        if (node.nodeType === Node.TEXT_NODE && !node.textContent.trim()) return false;
        return true;
      });
      if (children.length === 1) {
        contentCell = children[0];
      } else {
        contentCell = children;
      }
    } else {
      contentCell = '';
    }
    return [label, contentCell];
  });

  // Table cells as per spec
  const cells = [headerRow, ...tabRows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original cmp-tabs element with the table
  tabsBlock.replaceWith(block);
}
