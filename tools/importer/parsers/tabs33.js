/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .tabs or .cmp-tabs block within the element
  const tabsBlock = element.querySelector('.tabs .cmp-tabs') || element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get the tab labels (li elements inside ol[role=tablist])
  const tabList = tabsBlock.querySelector('ol[role=tablist]');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('li'));

  // Get the tab panels (div[role=tabpanel])
  const tabPanels = Array.from(tabsBlock.querySelectorAll('div[role=tabpanel]'));

  // Defensive: Ensure we have matching labels and panels
  if (tabLabels.length !== tabPanels.length) return;

  // Build the table rows
  const headerRow = ['Tabs (tabs33)'];
  const rows = [headerRow];

  for (let i = 0; i < tabLabels.length; i++) {
    const labelText = tabLabels[i].textContent.trim();
    // Defensive: fallback if label is empty
    const labelCell = labelText || `Tab ${i+1}`;

    // For the content cell, use the entire tab panel's content
    // We'll extract the children of the tabPanel div, not the div itself
    const panel = tabPanels[i];
    // Defensive: skip if panel is missing
    if (!panel) continue;

    // Get all direct children of the tab panel (excluding script/style)
    const contentNodes = Array.from(panel.childNodes).filter(node => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const tag = node.tagName.toLowerCase();
        return tag !== 'script' && tag !== 'style';
      }
      // Keep text nodes as well
      return !!node.textContent.trim();
    });

    // If there are no children, fallback to innerHTML as a text node
    let contentCell;
    if (contentNodes.length === 0) {
      contentCell = panel.textContent.trim();
    } else if (contentNodes.length === 1) {
      contentCell = contentNodes[0];
    } else {
      contentCell = contentNodes;
    }

    rows.push([labelCell, contentCell]);
  }

  // Create the table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabs block with the new table
  tabsBlock.replaceWith(table);
}
