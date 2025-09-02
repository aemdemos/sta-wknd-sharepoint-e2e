/* global WebImporter */
export default function parse(element, { document }) {
  // Find tabs block root
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels and panels
  const tabLabels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tablist .cmp-tabs__tab'));
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Header row
  const headerRow = ['Tabs (tabs3)'];

  // Tab labels row (second row, all labels, as in screenshot)
  const labelsRow = tabLabels.map(label => {
    // Use <strong> for active tab, else plain text
    if (label.classList.contains('cmp-tabs__tab--active')) {
      const strong = document.createElement('strong');
      strong.textContent = label.textContent.trim();
      return strong;
    }
    return label.textContent.trim();
  });

  // For each tab, build [label, panel-content] row
  const contentRows = tabLabels.map((label, idx) => {
    const tabLabel = label.textContent.trim();
    // Find corresponding panel by order
    const panel = tabPanels[idx];
    let tabContent = null;
    if (panel) {
      // Grab all immediate children (not clone, reference)
      // If only one child, reference it directly
      const children = Array.from(panel.children);
      if (children.length === 1) {
        tabContent = children[0];
      } else if (children.length > 1) {
        tabContent = children;
      } else {
        // fallback: use text content
        tabContent = panel.textContent.trim();
      }
    } else {
      tabContent = '';
    }
    return [tabLabel, tabContent];
  });

  // Compose final table cells
  const cells = [headerRow, labelsRow, ...contentRows];

  // Create and insert the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  tabsBlock.replaceWith(table);
}
