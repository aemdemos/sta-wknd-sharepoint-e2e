/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs element within the given element
  const tabsEl = element.querySelector('.cmp-tabs');
  if (!tabsEl) return;

  // Gather all tab labels (in order)
  const tabLabels = Array.from(
    tabsEl.querySelectorAll('.cmp-tabs__tablist > li')
  ).map((li) => li.textContent.trim());

  // Gather all tab panels (in order)
  const tabPanels = Array.from(
    tabsEl.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]')
  );

  // Prepare the table rows
  // Header row: exactly as required
  const headerRow = ['Tabs (tabs22)'];
  const rows = [headerRow];

  // For each tab, include label and referenced content
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];

    // Defensive: If panel missing, use empty string
    let contentEl = '';
    if (panel) {
      // The panel usually contains a .contentfragment with <article> as main content
      const contentFragment = panel.querySelector('.contentfragment');
      if (contentFragment) {
        // Use the contentfragment (references all interior content, including headings, images, text)
        contentEl = contentFragment;
      } else {
        // Fallback: use the whole panel
        contentEl = panel;
      }
    }
    rows.push([label, contentEl]);
  }

  // Create and replace with the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  tabsEl.replaceWith(block);
}
