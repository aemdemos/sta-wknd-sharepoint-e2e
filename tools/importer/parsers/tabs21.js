/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs wrapper. It may not be the root 'element', so scan descendants
  let tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) {
    // Try if the given element itself is the .cmp-tabs
    if (element.classList && element.classList.contains('cmp-tabs')) {
      tabsRoot = element;
    } else {
      // If not found, do nothing
      return;
    }
  }

  // Header row for block table EXACTLY as requested
  const headerRow = ['Tabs (tabs21)'];

  // Gather tab labels (in order)
  const tabList = tabsRoot.querySelector('.cmp-tabs__tablist');
  const tabLabels = [];
  if (tabList) {
    tabList.querySelectorAll('.cmp-tabs__tab').forEach(tab => {
      tabLabels.push(tab.textContent.trim());
    });
  }

  // Gather tab panels (in order)
  // Only panels that are direct children of the tabsRoot (to avoid nested tabs confusion)
  const allPanels = Array.from(tabsRoot.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));
  // Make sure to use only visible or all panels, as in the markup order
  // The order should follow tabLabels order

  // For each tab, create a row: [Tab Label, Tab Content]
  const rows = [headerRow];

  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    let contentPanel = allPanels[i];
    // Defensive: if not enough panels, skip
    if (!label || !contentPanel) continue;

    // Prefer to include the full article.cmp-contentfragment if present
    let mainContent = contentPanel.querySelector('article.cmp-contentfragment');
    if (!mainContent) {
      // fallback, use the contentfragment div directly
      mainContent = contentPanel.querySelector('.contentfragment');
    }
    if (!mainContent) mainContent = contentPanel;

    rows.push([label, mainContent]);
  }

  // Create the table and replace the element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
