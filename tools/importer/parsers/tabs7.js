/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs container (with class 'cmp-tabs')
  const tabsContainer = element.querySelector('.cmp-tabs');
  if (!tabsContainer) return;

  // Get tab headers (li elements inside ol[role="tablist"])
  const tabList = tabsContainer.querySelector('ol[role="tablist"]');
  if (!tabList) return;
  const tabHeaders = Array.from(tabList.querySelectorAll('li'));

  // Get tab panels (div[role="tabpanel"])
  const tabPanels = Array.from(tabsContainer.querySelectorAll('div[role="tabpanel"]'));

  // Defensive: Ensure the number of headers matches the number of panels
  if (tabHeaders.length !== tabPanels.length) return;

  // Build the table rows
  const rows = [];
  // Header row
  rows.push(['Tabs (tabs7)']);

  // For each tab, add a row: [Tab Label, Tab Content]
  for (let i = 0; i < tabHeaders.length; i++) {
    const header = tabHeaders[i];
    const panel = tabPanels[i];

    // Tab label: text content of the li
    const tabLabel = header.textContent.trim();

    // Tab content: collect all direct children of the panel, skipping empty text nodes
    const tabContentElements = [];
    Array.from(panel.childNodes).forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        tabContentElements.push(node);
      } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
        // Wrap text node in a <p> for structure
        const p = document.createElement('p');
        p.textContent = node.textContent.trim();
        tabContentElements.push(p);
      }
    });
    // If only one element, use it directly; if multiple, use array
    const tabContentCell = tabContentElements.length === 1 ? tabContentElements[0] : tabContentElements;

    rows.push([tabLabel, tabContentCell]);
  }

  // Create the table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original tabs container with the table
  tabsContainer.replaceWith(table);
}
