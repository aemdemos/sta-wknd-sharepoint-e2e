/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs container in the element
  const tabsContainer = element.querySelector('.cmp-tabs');
  if (!tabsContainer) return;

  // Gather tab labels from the tablist, in order
  const tabList = tabsContainer.querySelector('.cmp-tabs__tablist');
  const tabLabelEls = tabList ? tabList.querySelectorAll('.cmp-tabs__tab') : [];
  const tabsLabels = Array.from(tabLabelEls).map(tabEl => tabEl.textContent.trim());

  // Gather corresponding tab panels in order
  const tabPanels = tabsContainer.querySelectorAll('.cmp-tabs__tabpanel');

  // Create table header row as required by block
  const headerRow = ['Tabs (tabs36)'];
  const tableRows = [headerRow];

  // For each tab, create a row: [Tab Label, Tab Content]
  for (let i = 0; i < tabsLabels.length; i++) {
    const label = tabsLabels[i];
    const panel = tabPanels[i];
    if (!label || !panel) continue; // Only create rows for available labels and panels

    // Gather all child nodes from the panel, skipping empty nodes
    const contentNodes = Array.from(panel.childNodes).filter(node => {
      // Ignore empty text nodes
      return node.nodeType !== Node.TEXT_NODE || node.textContent.trim().length > 0;
    });

    // Reference existing DOM nodes for the content cell
    const contentCell = contentNodes.length === 1 ? contentNodes[0] : contentNodes;
    tableRows.push([label, contentCell]);
  }

  // Create the table using the block helper
  const table = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the original .cmp-tabs element with the new block table
  tabsContainer.replaceWith(table);
}
