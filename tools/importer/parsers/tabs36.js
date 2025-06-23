/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the tabs block
  const tabsContainer = element.querySelector('.tabs .cmp-tabs');
  if (!tabsContainer) return;

  // Tab Labels (first column)
  const tabLabelsEls = tabsContainer.querySelectorAll('.cmp-tabs__tablist > li');
  const tabLabels = Array.from(tabLabelsEls).map(li => li.textContent.trim());

  // Tab Panels (second column)
  const tabPanels = Array.from(
    tabsContainer.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]')
  );

  // Build the table header (block name EXACTLY as in requirements)
  const rows = [
    ['Tabs (tabs36)']
  ];

  // Each row: [Tab Label, Tab Content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    let contentCell;
    if (panel) {
      // Use all children of the panel as the content
      // Reference the actual elements from the DOM, do not clone
      const children = Array.from(panel.childNodes).filter(n => {
        // Ignore empty text nodes
        return !(n.nodeType === Node.TEXT_NODE && n.textContent.trim() === '');
      });
      if (children.length === 1) {
        contentCell = children[0];
      } else if (children.length > 1) {
        contentCell = children;
      } else {
        // fallback: empty div for empty panel
        contentCell = document.createElement('div');
      }
    } else {
      // If no panel, empty cell
      contentCell = document.createElement('div');
    }
    rows.push([label, contentCell]);
  }

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
