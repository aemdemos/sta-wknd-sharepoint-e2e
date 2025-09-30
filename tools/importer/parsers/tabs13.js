/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .tabs block (the main element passed in should be the tabs container)
  // Defensive: ensure we have the correct block
  const tabsBlock = element;
  if (!tabsBlock) return;

  // Always use the required header row
  const headerRow = ['Tabs (tabs13)'];
  const rows = [headerRow];

  // Find the cmp-tabs element
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get all tab labels
  const tabLabels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get all tab panels (content)
  const tabPanels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tabpanel'));

  // Defensive: ensure tab count matches panel count
  const tabCount = Math.min(tabLabels.length, tabPanels.length);

  for (let i = 0; i < tabCount; i++) {
    const label = tabLabels[i]?.textContent?.trim() || '';
    const panel = tabPanels[i];
    let content = null;
    if (panel) {
      // For resilience, use the entire tabpanel content as the cell
      // Remove aria-hidden panels if present (but keep the content)
      // Remove the tabpanel container itself, but keep its children
      // We'll use a DocumentFragment to collect the children
      const frag = document.createDocumentFragment();
      Array.from(panel.childNodes).forEach((node) => {
        frag.appendChild(node.cloneNode(true));
      });
      content = frag;
    } else {
      content = '';
    }
    rows.push([label, content]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element with the new table
  element.replaceWith(table);
}
