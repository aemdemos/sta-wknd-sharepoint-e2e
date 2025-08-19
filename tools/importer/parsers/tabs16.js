/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs block
  const tabsBlock = element.querySelector('.tabs');
  if (!tabsBlock) return;

  // Find the cmp-tabs element within the tabs block
  const tabsRoot = tabsBlock.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get tab labels in order from tablist
  const tabLabels = Array.from(tabsRoot.querySelectorAll('.cmp-tabs__tablist > li')).map(li => li.textContent.trim());

  // Get all tab panels in order
  const tabPanels = Array.from(tabsRoot.querySelectorAll('.cmp-tabs__tabpanel'));

  // Table header as per spec
  const headerRow = ['Tabs (tabs16)'];
  const rows = [headerRow];

  // For each tab: extract label and reference actual tabpanel content
  tabLabels.forEach((label, idx) => {
    const panel = tabPanels[idx];
    let contentElements = [];
    if (panel) {
      // Get all children inside the tabpanel
      // If there's a single contentfragment/article, use it directly
      const cf = panel.querySelector('article');
      if (cf) {
        contentElements = [cf];
      } else {
        // Use all element children (skip empty grids/divs)
        contentElements = Array.from(panel.childNodes).filter(n => {
          if (n.nodeType === 1) {
            // If an empty grid or div, skip
            if (
              n.tagName === 'DIV' &&
              n.className &&
              n.className.includes('aem-Grid') &&
              n.innerHTML.trim() === ''
            ) {
              return false;
            }
            return true;
          }
          if (n.nodeType === 3) {
            // Text node: only if not whitespace
            return n.textContent.trim() !== '';
          }
          return false;
        });
      }
    }
    // semantic meaning: label in first cell, referenced content in second cell
    rows.push([label, contentElements.length === 1 ? contentElements[0] : contentElements]);
  });

  // Create the tabs block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block with the new table
  tabsBlock.replaceWith(block);
}
