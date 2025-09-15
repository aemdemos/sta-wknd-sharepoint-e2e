/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the tabs block
  const tabsBlock = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  if (!tabsBlock) return;

  // Find the actual tabs container (could be .cmp-tabs)
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs') || tabsBlock;
  if (!cmpTabs) return;

  // Get tab labels
  const tabLabels = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tablist > li[role="tab"]')
  ).map(tab => tab.textContent.trim());

  // Get tab panels
  const tabPanels = Array.from(
    cmpTabs.querySelectorAll('[role="tabpanel"]')
  );

  // Defensive: Ensure labels and panels match
  if (tabLabels.length !== tabPanels.length) {
    // Try to recover: only use as many as both exist
    const minLen = Math.min(tabLabels.length, tabPanels.length);
    tabLabels.length = minLen;
    tabPanels.length = minLen;
  }

  // Build table rows
  const rows = [];
  const headerRow = ['Tabs (tabs11)'];
  rows.push(headerRow);

  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    // Defensive: If panel is missing, skip
    if (!panel) continue;

    // For tab content: grab everything inside the panel
    // Usually a single .contentfragment, but could be multiple children
    // We'll reference the whole panel content for resilience
    const tabContent = Array.from(panel.childNodes).filter(
      node => {
        // Only keep elements or text nodes with actual content
        if (node.nodeType === Node.ELEMENT_NODE) {
          // Ignore empty grid wrappers
          if (node.classList && node.classList.contains('aem-Grid')) return false;
          return true;
        }
        if (node.nodeType === Node.TEXT_NODE) {
          return node.textContent.trim().length > 0;
        }
        return false;
      }
    );
    // If only one element, use it directly, else use array
    const tabCell = tabContent.length === 1 ? tabContent[0] : tabContent;
    rows.push([label, tabCell]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block with the new table
  tabsBlock.replaceWith(block);
}
