/* global WebImporter */
export default function parse(element, { document }) {
  // Only operate if this is a cmp-tabs block
  if (!element || !element.classList.contains('cmp-tabs')) return;

  // Header row as per requirements
  const headerRow = ['Tabs (tabs30)'];
  const rows = [headerRow];

  // Get tab labels
  const tabList = element.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('.cmp-tabs__tab'));

  // Get tab panels (content)
  const tabPanels = Array.from(element.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Defensive: If mismatch, bail
  if (tabLabels.length !== tabPanels.length) return;

  // For each tab, add a row: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];

    // Defensive: If panel is missing, skip
    if (!panel) continue;

    // For content, clone all children from the tabpanel
    const contentDiv = document.createElement('div');
    Array.from(panel.childNodes).forEach((node) => {
      contentDiv.appendChild(node.cloneNode(true));
    });

    rows.push([label, contentDiv]);
  }

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs element with the table
  if (table) {
    element.parentNode.replaceChild(table, element);
  }
}
