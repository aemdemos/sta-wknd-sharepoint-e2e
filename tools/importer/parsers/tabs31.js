/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs container
  const tabsContainer = element.querySelector('.cmp-tabs');
  if (!tabsContainer) return;

  // Get tab headers (tab titles)
  const tabHeaders = Array.from(
    tabsContainer.querySelectorAll('.cmp-tabs__tablist > li[role="tab"]')
  );

  // Get tab panels (tab content)
  const tabPanels = Array.from(
    tabsContainer.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Defensive: Only continue if we have matching tabs and panels
  if (!tabHeaders.length || !tabPanels.length) return;

  // Build rows: first row is header
  const rows = [
    ['Tabs (tabs31)']
  ];

  // For each tab, add a row: [tab label, tab content]
  for (let i = 0; i < tabHeaders.length; i++) {
    const tabLabel = tabHeaders[i].textContent.trim();
    // Defensive: get the corresponding panel (may be less panels than headers)
    const tabPanel = tabPanels[i];
    let contentCell = '';
    if (tabPanel) {
      // For robustness, collect all direct children of the tabPanel's contentfragment/article
      const contentFragment = tabPanel.querySelector('.contentfragment, article, .cmp-contentfragment');
      if (contentFragment) {
        // Collect all children except script/style
        const contentNodes = Array.from(contentFragment.childNodes).filter(
          (node) => node.nodeType === 1 && node.tagName !== 'SCRIPT' && node.tagName !== 'STYLE'
        );
        if (contentNodes.length) {
          contentCell = contentNodes;
        } else {
          // fallback: use the contentFragment itself
          contentCell = contentFragment;
        }
      } else {
        // fallback: use the tabPanel itself
        contentCell = tabPanel;
      }
    }
    rows.push([tabLabel, contentCell]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element with the new block
  element.replaceWith(block);
}
