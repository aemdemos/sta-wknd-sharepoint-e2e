/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cmp-tabs block within the element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Tab labels (in order)
  const tablist = tabsBlock.querySelector('.cmp-tabs__tablist');
  const tabLabels = Array.from(tablist ? tablist.querySelectorAll('.cmp-tabs__tab') : []);

  // Tab panels (in order)
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Table rows
  const rows = [['Tabs (tabs13)']]; // Header row exactly as required

  // Iterate and add each tab label and its content panel
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i]?.textContent?.trim() || '';
    let panel = tabPanels[i] || null;
    // Defensive: If not found, try by aria-controls
    if (!panel && tabLabels[i]?.hasAttribute('aria-controls')) {
      const pid = tabLabels[i].getAttribute('aria-controls');
      panel = tabsBlock.querySelector(`#${pid}`);
    }
    // Defensive: If panel is missing, provide blank cell
    rows.push([label, panel ? panel : '']);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the tabs block in the DOM
  tabsBlock.replaceWith(block);
}
