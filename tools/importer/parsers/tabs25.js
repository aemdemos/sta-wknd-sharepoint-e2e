/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the tabs block
  const tabsBlock = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  if (!tabsBlock) return;

  // Find the cmp-tabs element (may be nested)
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs') || tabsBlock;
  if (!cmpTabs) return;

  // Get tab labels from the tablist
  const tabLabels = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tablist > li[role="tab"]')
  ).map(tab => tab.textContent.trim());

  // Get tab panels (content)
  const tabPanels = Array.from(
    cmpTabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]')
  );

  // Defensive: ensure labels and panels match
  if (tabLabels.length !== tabPanels.length) {
    // Try to recover by matching by aria-controls
    // But for this block, just skip if mismatch
    return;
  }

  // Build table rows
  const headerRow = ['Tabs (tabs25)'];
  const rows = [headerRow];

  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];

    // Defensive: collect all direct children of the tabpanel
    // Usually a contentfragment/article, but may vary
    // We'll combine all children into a single cell
    const contentElements = [];
    // Only include non-empty elements
    Array.from(panel.children).forEach(child => {
      // Defensive: skip empty grid wrappers
      if (
        child.classList.contains('aem-Grid') ||
        (child.tagName === 'DIV' && child.children.length === 0 && child.textContent.trim() === '')
      ) {
        return;
      }
      contentElements.push(child);
    });
    // If no children, fallback to panel itself
    const contentCell = contentElements.length > 0 ? contentElements : [panel];

    rows.push([label, contentCell]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabs block with the new table
  tabsBlock.replaceWith(block);
}
