/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs element inside the given element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get all tab labels (each <li> in tablist)
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('.cmp-tabs__tab'));

  // Get all panels
  const tabPanels = Array.from(tabs.querySelectorAll('.cmp-tabs__tabpanel'));

  // Prepare header row as per requirements
  const headerRow = ['Tabs (tabs9)'];
  const rows = [headerRow];

  // For each tab, create a row: [tab label, tab content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    // Use the label element itself for reference, preserving any formatting
    // But only keep the text as a <strong> as per example
    const strongLabel = document.createElement('strong');
    strongLabel.textContent = label.textContent.trim();

    // The content is the ENTIRE tabpanel's children (preserve all structure)
    const tabPanel = tabPanels[i];
    let contentCell;
    if (tabPanel) {
      // Tab panel may contain multiple children, filter empty text nodes
      const contentNodes = Array.from(tabPanel.childNodes).filter(n => {
        if (n.nodeType === Node.TEXT_NODE) {
          return n.textContent.trim().length > 0;
        }
        return true;
      });
      // If only one node, use it directly, otherwise use the array
      contentCell = contentNodes.length === 1 ? contentNodes[0] : contentNodes;
    } else {
      // If missing, use empty string
      contentCell = '';
    }
    rows.push([strongLabel, contentCell]);
  }

  // Create the table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element in the DOM
  element.replaceWith(table);
}
