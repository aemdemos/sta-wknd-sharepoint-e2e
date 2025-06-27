/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block by class name inside the main container
  const tabsBlock = element.querySelector('.tabs .cmp-tabs');
  if (!tabsBlock) return;

  // Get the tab labels (order matters)
  const tabLabels = Array.from(
    tabsBlock.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab')
  ).map(tab => tab.textContent.trim());

  // Get tab panels (order should match tabLabels)
  const tabPanels = Array.from(
    tabsBlock.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Defensive: number of tabs and panels should match
  if (!tabLabels.length || tabLabels.length !== tabPanels.length) return;

  // Build the block header as in the example
  const headerRow = ['Tabs (tabs34)'];

  // The *second row* is the tab labels as headers (should use th cells, but createTable only th's first row)
  // So we'll accept that and provide the labels as a normal row
  // The *third row* is the content for each tab, in corresponding order
  const tabContentRow = tabPanels.map((panel) => {
    // Collect all meaningful content child nodes
    const children = Array.from(panel.childNodes).filter(
      node =>
        !(node.nodeType === Node.ELEMENT_NODE &&
          (node.tagName.toLowerCase() === 'script' || node.tagName.toLowerCase() === 'style')) &&
        !(node.nodeType === Node.TEXT_NODE && !node.textContent.trim())
    );
    return children.length === 1 ? children[0] : children;
  });

  // Assemble per the example: header row, then a single row with tab label cells, then a single row with tab content cells
  const cells = [
    headerRow,
    tabLabels,
    tabContentRow
  ];

  // Create table block
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the tabs block with our new block table
  tabsBlock.parentNode.replaceChild(table, tabsBlock);
}
