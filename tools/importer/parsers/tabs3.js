/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block in the current element
  const tabsContainer = element.querySelector('.cmp-tabs');
  if (!tabsContainer) return;

  // Get the tab labels in order
  const tabList = tabsContainer.querySelector('.cmp-tabs__tablist');
  const tabLabels = [];
  if (tabList) {
    tabList.querySelectorAll('[role="tab"]').forEach(tab => {
      tabLabels.push(tab.textContent.trim());
    });
  }

  // Get the tab panels in order (corresponds to tabLabels)
  const tabPanels = Array.from(
    tabsContainer.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Prepare the header row (block name as required)
  const headerRow = ['Tabs (tabs3)'];
  // Prepare the labels row (one cell per tab label)
  const labelRow = tabLabels;

  // Prepare the content row (one cell per tab panel)
  const contentRow = tabPanels.map(panel => {
    // For best compatibility, wrap everything inside the tab panel in a div
    // Reference existing elements directly when possible
    if (panel.childElementCount === 1) {
      // If single root element, return it directly
      return panel.firstElementChild;
    } else {
      // Multiple nodes, wrap all children in a div
      const wrapper = document.createElement('div');
      Array.from(panel.childNodes).forEach(child => {
        // Only append actual content
        if (child.nodeType === 1 || (child.nodeType === 3 && child.textContent.trim())) {
          wrapper.appendChild(child);
        }
      });
      return wrapper;
    }
  });

  // Assemble the table
  const cells = [headerRow, labelRow, contentRow];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original tabs block with the new table
  tabsContainer.replaceWith(block);
}
