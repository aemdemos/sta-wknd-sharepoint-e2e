/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the .cmp-tabs block within the given element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get tab labels from the tablist (ol > li)
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('li'));

  // Get tab panels (content for each tab)
  const tabPanels = Array.from(tabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Build rows: each row is [Tab Label, Tab Content]
  const rows = [];
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i]?.textContent?.trim() || '';
    // Defensive: find the corresponding tabpanel
    const panel = tabPanels[i];
    if (!panel) continue;
    // For content, use the entire tabpanel's content (children)
    // We'll collect all direct children of the tabpanel
    const contentElements = Array.from(panel.childNodes).filter(node => {
      // Only include element nodes and non-empty text nodes
      return (node.nodeType === Node.ELEMENT_NODE) || (node.nodeType === Node.TEXT_NODE && node.textContent.trim());
    });
    rows.push([label, contentElements]);
  }

  // Table header row as required
  const headerRow = ['Tabs (tabs36)'];
  const tableRows = [headerRow, ...rows];

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the original tabs element with the table
  tabs.replaceWith(table);
}
