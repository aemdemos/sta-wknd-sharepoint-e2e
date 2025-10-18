/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsContainer = element.querySelector('.tabs, .panelcontainer');
  if (!tabsContainer) return;

  // Find the actual tabs component inside the container
  const cmpTabs = tabsContainer.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels from the tablist
  const tabLabels = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tablist > li[role="tab"]')
  ).map(tab => tab.textContent.trim());

  // Get tab panels (content)
  const tabPanels = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Defensive: Only proceed if we have labels and panels
  if (!tabLabels.length || tabPanels.length !== tabLabels.length) return;

  // Build rows: header first, then one row per tab (label, content)
  const rows = [];
  rows.push(['Tabs (tabs3)']);

  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];

    // Defensive: clone the panel's content so we don't move it from DOM
    // But we want to preserve the structure, so we reference the panel's children
    const contentElements = Array.from(panel.childNodes).filter(node => {
      // Only include elements and text nodes with meaningful content
      if (node.nodeType === Node.ELEMENT_NODE) {
        // Exclude empty grid wrappers
        if (
          node.classList &&
          node.classList.contains('aem-Grid') &&
          node.children.length === 0
        ) {
          return false;
        }
        return true;
      }
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent.trim().length > 0;
      }
      return false;
    });

    // If the panel is empty, fallback to an empty string
    rows.push([label, contentElements.length ? contentElements : '']);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block with the new table
  tabsContainer.replaceWith(block);
}
