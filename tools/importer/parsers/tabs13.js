/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs element inside the given element
  const tabsEl = element.querySelector('.cmp-tabs');
  if (!tabsEl) return;

  // Get all tab labels from the tablist
  const tabLabels = Array.from(tabsEl.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get all tab panel containers
  const tabPanels = Array.from(tabsEl.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Header: block name exactly as in the requirements
  const headerRow = ['Tabs (tabs13)'];
  const cells = [headerRow];

  // For each tab, create a row: [label, content]
  tabLabels.forEach((labelEl, i) => {
    // Use the text of the tab label
    const label = labelEl.textContent.trim();
    // Reference the panel for this tab (by order)
    const panel = tabPanels[i];
    // Find the MAIN content inside the panel
    // The content is usually the first .contentfragment > article child
    let tabContent = null;
    if (panel) {
      // Use the article.cmp-contentfragment if present, otherwise the first non-empty child
      tabContent = panel.querySelector('article.cmp-contentfragment') || Array.from(panel.children).find(c => c.innerHTML.trim());
    }
    // Fallback: If still no content, use a blank string
    cells.push([
      label, // first cell: tab label (plain string, as in example)
      tabContent || '' // second cell: reference existing element, not a clone
    ]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the .cmp-tabs element with the new table
  tabsEl.replaceWith(table);
}