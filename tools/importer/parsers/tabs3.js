/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block in the given element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) {
    return;
  }

  // Get all tab labels from the tablist in order
  const tabLabels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tablist .cmp-tabs__tab'));
  // Get all tab panels (content per tab), in order
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Prepare the header row as per specification
  const table = [['Tabs (tabs3)']];

  // For each tab, extract its label and its content (the whole panel)
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i]?.textContent?.trim() || '';
    const panel = tabPanels[i];
    if (!panel) continue;
    // Find first real element node in panel (skip whitespace)
    let contentElem = null;
    for (const child of panel.childNodes) {
      if (child.nodeType === Node.ELEMENT_NODE) {
        contentElem = child;
        break;
      }
    }
    // If no element node, fallback to the panel element itself
    if (!contentElem) contentElem = panel;
    table.push([label, contentElem]);
  }

  // Create the block table and replace the original tabs block
  const block = WebImporter.DOMUtils.createTable(table, document);
  tabsBlock.replaceWith(block);
}
