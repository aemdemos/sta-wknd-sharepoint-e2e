/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs element (the Tabs block root)
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get the tab labels from the tablist (should be <li> inside <ol> with role="tablist")
  const tabList = tabsRoot.querySelector('[role="tablist"]');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('[role="tab"]')).map(li => li.textContent.trim());

  // Get all tabpanels (each tab's content)
  const tabPanels = Array.from(tabsRoot.querySelectorAll('[role="tabpanel"]'));

  // Compose the table rows
  const rows = [];
  // Header row: EXACT header per spec
  rows.push(['Tabs (tabs3)']);

  // Each tab (label, content)
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    if (!panel) continue; // skip if no content
    // Try to find the main content node for this tab
    // We'll include all children of the panel, excluding possible empty layout helpers
    // We avoid duplicating elements, so we reference what's in the DOM
    // We'll collect all non-empty direct children of the tabpanel
    const contentNodes = Array.from(panel.childNodes).filter(node => {
      // Exclude empty text nodes and empty layout divs
      if (node.nodeType === Node.TEXT_NODE) return node.textContent.trim().length > 0;
      if (node.nodeType === Node.ELEMENT_NODE) {
        // Check if element is a layout helper that's empty
        if (
          node.classList.contains('aem-Grid') ||
          (node.tagName === 'DIV' && node.innerHTML.trim() === '')
        ) {
          return false;
        }
        // Exclude grid wrappers that have only empty content
        if (
          node.classList.contains('aem-GridColumn') &&
          node.innerHTML.trim() === ''
        ) return false;
        // Otherwise keep
        return true;
      }
      return false;
    });
    // If all nodes were filtered, fallback to the panel itself
    let contentToInsert;
    if (contentNodes.length === 0) {
      contentToInsert = panel;
    } else if (contentNodes.length === 1) {
      contentToInsert = contentNodes[0];
    } else {
      contentToInsert = contentNodes;
    }
    // Row: [Tab Label, Tab Content]
    rows.push([label, contentToInsert]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the cmp-tabs element itself in the DOM with the newly created block table
  tabsRoot.replaceWith(block);
}
