/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs container
  const tabsContainer = element.querySelector('.cmp-tabs');
  if (!tabsContainer) return;

  // Find tab headers (li elements inside tablist)
  const tabHeaderList = tabsContainer.querySelector('.cmp-tabs__tablist');
  if (!tabHeaderList) return;
  const tabHeaders = Array.from(tabHeaderList.querySelectorAll('li'));

  // Find tab panels (divs with role="tabpanel")
  const tabPanels = Array.from(tabsContainer.querySelectorAll('[role="tabpanel"]'));
  if (tabHeaders.length !== tabPanels.length) return;

  // Build table rows
  const rows = [];
  // Header row
  rows.push(['Tabs (tabs38)']);

  // For each tab, extract label and content
  for (let i = 0; i < tabHeaders.length; i++) {
    const header = tabHeaders[i];
    const panel = tabPanels[i];
    // Tab label: use textContent
    const label = header.textContent.trim();
    // Tab content: clone the panel's children into a fragment
    const contentFragment = document.createDocumentFragment();
    Array.from(panel.childNodes).forEach(node => {
      if (node.nodeType === Node.TEXT_NODE && !node.textContent.trim()) return;
      contentFragment.appendChild(node.cloneNode(true));
    });
    rows.push([label, contentFragment]);
  }

  // Create the table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(table);
}
