/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs container inside the given element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get all tab labels (li elements in .cmp-tabs__tablist)
  const labelEls = tabs.querySelectorAll('.cmp-tabs__tablist > li');
  // Get all tab panels in order
  const panelEls = tabs.querySelectorAll('.cmp-tabs__tabpanel');

  // Check if we have matching number of labels and panels
  if (labelEls.length === 0 || panelEls.length === 0 || labelEls.length !== panelEls.length) {
    return;
  }

  // Build the header row
  const headerRow = ['Tabs (tabs34)'];
  const cells = [headerRow];

  // For each tab, gather label and content fragment
  for (let i = 0; i < labelEls.length; i++) {
    const labelText = labelEls[i].textContent.trim();
    // The corresponding panel
    const panel = panelEls[i];
    // We want the main content in the panel; if contentfragment exists use that, else the panel itself
    const contentFragment = panel.querySelector('.contentfragment') || panel;
    cells.push([labelText, contentFragment]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
