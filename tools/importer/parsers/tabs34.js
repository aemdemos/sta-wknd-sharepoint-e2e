/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the main tabs block
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Extract all tab label elements in order
  const tabLabels = Array.from(tabsRoot.querySelectorAll('.cmp-tabs__tablist > li'));
  // Extract all tab panel elements in order
  const tabPanels = Array.from(tabsRoot.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Build the header row with the exact block name
  const cells = [
    ['Tabs (tabs34)']
  ];

  // For each tab, add a row: [label, panel content]
  for (let i = 0; i < tabLabels.length; i++) {
    const labelElem = tabLabels[i];
    const panelElem = tabPanels[i];
    if (!labelElem || !panelElem) continue;
    // Reuse the label element (as-is, with formatting)
    // To follow the example (header cell bolded), wrap in <strong>
    const label = document.createElement('strong');
    label.textContent = labelElem.textContent.trim();
    // Place all *direct* children of the tabpanel into the content cell
    // Reference (not clone) the original elements from the document
    const panelContent = [];
    Array.from(panelElem.childNodes).forEach(child => {
      // Only include non-empty nodes
      if (child.nodeType === Node.ELEMENT_NODE || (child.nodeType === Node.TEXT_NODE && child.textContent.trim())) {
        panelContent.push(child);
      }
    });
    const contentCell = panelContent.length === 1 ? panelContent[0] : panelContent.length > 1 ? panelContent : '';
    cells.push([
      label,
      contentCell
    ]);
  }

  // Create and replace with the new block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
