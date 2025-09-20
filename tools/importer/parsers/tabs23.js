/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  if (!tabsBlock) return;

  // Find the cmp-tabs element
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels from the tablist
  const tabLabels = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tablist > li[role="tab"]')
  ).map(tab => tab.textContent.trim());

  // Get tab panels
  const tabPanels = Array.from(
    cmpTabs.querySelectorAll('[role="tabpanel"]')
  );

  // Block header row
  const headerRow = ['Tabs (tabs23)'];

  // Build rows: [label, content]
  const rows = tabLabels.map((label, i) => {
    const panel = tabPanels[i];
    let contentCell = '';
    if (panel) {
      // Reference the main contentfragment/article if present
      const contentFragment = panel.querySelector('.cmp-contentfragment, article');
      if (contentFragment) {
        contentCell = contentFragment;
      } else {
        // Fallback: use all element children
        const children = Array.from(panel.childNodes).filter(n => n.nodeType === 1);
        if (children.length) {
          contentCell = children;
        } else {
          // Fallback: use text
          contentCell = panel.textContent.trim();
        }
      }
    }
    return [label, contentCell];
  });

  // Compose table cells
  const cells = [headerRow, ...rows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the tabs block with the new block table
  tabsBlock.replaceWith(block);
}
