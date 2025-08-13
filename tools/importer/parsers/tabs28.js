/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block in the element (cmp-tabs)
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get all tab label elements and their text
  const tabLabelElements = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tablist > li'));
  const tabLabels = tabLabelElements.map(li => li.textContent.trim());

  // Get all tab panels, order should correspond to tabLabels
  const tabPanelElements = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tabpanel'));

  // Compose the header row exactly as required
  const headerRow = ['Tabs (tabs28)'];

  // Each tab gets its own row: [Tab Label, Tab Content]
  const rows = [headerRow];
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    // Get tab content (should handle nested content blocks)
    const panel = tabPanelElements[i];
    let tabContent = null;
    if (panel) {
      // Use all immediate children except for empty grids
      // Prefer the main contentfragment/article block if present
      let contentFragment = panel.querySelector('article') || panel.querySelector('.contentfragment');
      if (contentFragment) {
        tabContent = contentFragment;
      } else {
        // Fallback: Use all children
        tabContent = document.createElement('div');
        Array.from(panel.childNodes).forEach((node) => {
          // Skip empty text nodes or empty grid divs
          if (node.nodeType === 3 && !node.textContent.trim()) return;
          if (node.nodeType === 1 && node.classList.contains('aem-Grid')) return;
          tabContent.appendChild(node);
        });
      }
    } else {
      // Fallback: create empty div for missing panel
      tabContent = document.createElement('div');
    }
    rows.push([label, tabContent]);
  }

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabs block element with the table
  tabsBlock.replaceWith(table);
}
