/* global WebImporter */
export default function parse(element, { document }) {
  // Only operate if this is the tabs block
  if (!element || !element.classList.contains('tabs')) return;

  // Header row for the block table
  const headerRow = ['Tabs (tabs23)'];

  // Find the tabs container and its tablist
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get tab labels (li elements)
  const tabLabels = Array.from(
    tabsRoot.querySelectorAll('.cmp-tabs__tablist > li[role="tab"]')
  );

  // Get tab panels (divs with role="tabpanel")
  const tabPanels = Array.from(
    tabsRoot.querySelectorAll('div[role="tabpanel"][data-cmp-hook-tabs="tabpanel"]')
  );

  // Defensive: ensure labels and panels match
  if (tabLabels.length !== tabPanels.length) return;

  // Remove the tabs block from the DOM before replacing
  // This ensures the DOM is modified even if the block is empty
  const parent = element.parentNode;

  // Build rows: each row is [tab label, tab content]
  const rows = tabLabels.map((labelEl, idx) => {
    // Tab label text
    const labelText = labelEl.textContent.trim();
    // Tab panel content: clone the tabpanel and remove aria-hidden
    const panelEl = tabPanels[idx].cloneNode(true);
    panelEl.removeAttribute('aria-hidden');
    return [labelText, panelEl];
  });

  // Compose the table data
  const tableData = [headerRow, ...rows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableData, document);

  // Replace the original element with the block table
  parent.replaceChild(block, element);
}
