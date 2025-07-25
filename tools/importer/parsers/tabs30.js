/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the cmp-tabs block inside the parsed element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Prepare the header row exactly as required
  const tableCells = [['Tabs (tabs30)']];

  // Get all tab labels and all tab panels in order
  const tabLabels = Array.from(tabs.querySelectorAll('.cmp-tabs__tablist > li'));
  const tabPanels = Array.from(tabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));
  
  // For edge cases: ensure we only iterate over pairs, as there may be more labels than panels or vice versa
  const tabCount = Math.min(tabLabels.length, tabPanels.length);

  for (let i = 0; i < tabCount; i++) {
    const labelText = tabLabels[i].textContent.trim();
    // Reference the actual tab panel element for resilience
    const content = tabPanels[i];
    tableCells.push([labelText, content]);
  }

  // Build block table and replace the original tabs block
  const block = WebImporter.DOMUtils.createTable(tableCells, document);
  tabs.replaceWith(block);
}
