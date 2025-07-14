/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs component
  const tabsContainer = element.querySelector('.cmp-tabs');
  if (!tabsContainer) return;

  // Extract tab labels
  const tabLabels = Array.from(tabsContainer.querySelectorAll('.cmp-tabs__tablist > li'));
  // Extract tab panels
  const tabPanels = Array.from(tabsContainer.querySelectorAll('[role="tabpanel"]'));

  if (tabLabels.length !== tabPanels.length || tabLabels.length === 0) return;

  // Build header row with block name
  const cells = [[ 'Tabs (tabs15)' ]];

  // For each tab, get label and all content inside the tabpanel
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];
    // Reference all children of the tabpanel, avoid wrapping in a new div (per guidelines)
    const contentElements = Array.from(panel.childNodes).filter(node => {
      // Only include real nodes
      if (node.nodeType === Node.ELEMENT_NODE) return true;
      // Include non-empty text nodes
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) return true;
      return false;
    });
    cells.push([label, contentElements]);
  }

  // Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the tabs container with the new table
  tabsContainer.replaceWith(block);
}