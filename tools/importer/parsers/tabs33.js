/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs container (the one containing the tabs and tabpanels)
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Extract tab labels
  const tabTitles = Array.from(tabs.querySelectorAll('.cmp-tabs__tablist .cmp-tabs__tab'));
  // Extract tab panels in DOM order
  const tabPanels = Array.from(tabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Defensive check
  if (tabTitles.length === 0 || tabTitles.length !== tabPanels.length) return;

  // Build header row as per spec
  const headerRow = ['Tabs (tabs33)'];
  const tableRows = [headerRow];

  // For each tab, add a row: [label, content]
  for (let i = 0; i < tabTitles.length; i++) {
    const label = tabTitles[i].textContent.trim();
    const panel = tabPanels[i];
    // The content for the tab is ALL the child nodes of the tabPanel (including all HTML structure)
    // We'll collect all ELEMENT nodes (and non-empty text nodes in a <span> to preserve all source text)
    const tabContent = [];
    panel.childNodes.forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        tabContent.push(node);
      } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
        // Wrap text node in a <span> for safe DOM referencing
        const span = document.createElement('span');
        span.textContent = node.textContent.trim();
        tabContent.push(span);
      }
    });
    tableRows.push([label, tabContent]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  // Replace the tabs block with the block table
  tabs.replaceWith(table);
}
