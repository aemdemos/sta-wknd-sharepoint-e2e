/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block in the provided element
  const tabsBlock = element.querySelector('.tabs.panelcontainer');
  if (!tabsBlock) return;

  // Find the tabs component
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get all tab labels from the tablist
  const tabLabelsEls = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab')
  );
  const tabLabels = tabLabelsEls.map(tab => tab.textContent.trim());

  // Get all corresponding tab panels in order
  // These panels always have data-cmp-hook-tabs="tabpanel"
  const tabPanels = Array.from(
    cmpTabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]')
  );

  // Compose the table rows: header, tab labels, tab contents
  // Header row as specified
  const headerRow = ['Tabs (tabs25)'];
  // Tab labels row (each label in its own cell)
  const tabsLabelRow = tabLabels;

  // Tab content row (each cell, the main content for the tab)
  const tabsContentRow = tabPanels.map(panel => {
    // Try to extract the main content for each tab panel
    // Usually there is an article > .cmp-contentfragment__elements
    const contentFragment = panel.querySelector('article');
    if (contentFragment) {
      const mainElements = contentFragment.querySelector('.cmp-contentfragment__elements');
      if (mainElements) {
        // Reference the node directly
        return mainElements;
      }
      // If it doesn't exist, reference the article itself
      return contentFragment;
    }
    // If no article, use the panel itself
    return panel;
  });

  // Build the table: header, labels, content
  const cells = [
    headerRow,
    tabsLabelRow,
    tabsContentRow
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original tabs block with the new block table
  tabsBlock.replaceWith(block);
}
