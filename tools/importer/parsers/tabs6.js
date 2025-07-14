/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs block
  const tabsBlock = element.querySelector('.tabs .cmp-tabs');
  if (!tabsBlock) return;

  // Find tab headers (labels)
  const tabLabels = Array.from(
    tabsBlock.querySelectorAll(':scope > ol[role="tablist"] > li')
  );

  // Find tab panels (content containers)
  const tabPanels = Array.from(
    tabsBlock.querySelectorAll(':scope > div[data-cmp-hook-tabs="tabpanel"]')
  );

  // Build the header row: block name exactly as specified
  const cells = [
    ['Tabs (tabs6)']
  ];

  // For each tab, get its label and the corresponding tab panel content
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i]?.textContent?.trim() || '';
    const panel = tabPanels[i];
    if (!panel) continue;

    // Find the primary content element for the tab (as shown visually)
    // Normally a .contentfragment element inside the tab panel
    let contentElem = panel.querySelector('.contentfragment');
    // If not found, fall back to the full panel content
    if (!contentElem) {
      // If panel has just one main element, use it; else use panel itself
      const directChildren = Array.from(panel.children).filter(
        (ch) => ch.nodeType === 1 && ch.tagName !== 'SCRIPT' && ch.tagName !== 'STYLE'
      );
      if (directChildren.length === 1) {
        contentElem = directChildren[0];
      } else {
        contentElem = panel;
      }
    }

    // Reference the actual content element from the DOM, do not clone
    cells.push([label, contentElem]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original .cmp-tabs node in the DOM with the block table
  tabsBlock.parentNode.replaceChild(block, tabsBlock);
}
