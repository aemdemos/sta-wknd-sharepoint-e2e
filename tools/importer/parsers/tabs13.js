/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs block within this element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Header row
  const headerRow = ['Tabs (tabs13)'];
  const tableRows = [headerRow];

  // Get tab labels from the tablist (they should match the tabs and their tabpanels)
  const tabLabels = Array.from(
    tabsBlock.querySelectorAll('.cmp-tabs__tablist .cmp-tabs__tab')
  ).map(tab => tab.textContent.trim());

  // Get all tab panels in order
  const tabPanels = Array.from(
    tabsBlock.querySelectorAll('[role="tabpanel"]')
  );

  // Iterate through tabs and panels
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    let content = '';
    if (panel) {
      // For robustness: gather all children of the tabpanel.
      // We want to preserve all structure, formatting and media as in the original tab content.
      const nodes = Array.from(panel.childNodes).filter(
        node => !(node.nodeType === Node.TEXT_NODE && node.textContent.trim() === '')
      );
      // If there is just one main wrapper (common with AEM), use that, else combine all
      if (nodes.length === 1) {
        content = nodes[0];
      } else if (nodes.length > 1) {
        const wrapper = document.createElement('div');
        nodes.forEach(child => wrapper.appendChild(child));
        content = wrapper;
      }
    }
    tableRows.push([label, content]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the original tabs block with the new block table
  tabsBlock.replaceWith(block);
}
