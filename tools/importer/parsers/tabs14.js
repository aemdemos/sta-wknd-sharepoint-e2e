/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the tabs container
  let tabsContainer = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  if (!tabsContainer) return;
  let cmpTabs = tabsContainer.classList.contains('cmp-tabs') ? tabsContainer : tabsContainer.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels (order matters)
  const tabLabels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get tab panels (order should match tab labels)
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[role="tabpanel"]'));
  if (tabLabels.length !== tabPanels.length) return;

  // Build table rows
  const rows = [];
  // Header row: must match block name exactly
  rows.push(['Tabs (tabs14)']);

  // For each tab, extract label and content
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];
    // Create a div to hold tab content
    const contentDiv = document.createElement('div');
    // Copy all direct children (preserving semantic HTML)
    Array.from(panel.childNodes).forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.TEXT_NODE) {
        // Reference images and elements, do not clone
        if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'IMG') {
          contentDiv.appendChild(node);
        } else {
          contentDiv.appendChild(node.cloneNode(true));
        }
      }
    });
    // If content is empty, add an empty string
    if (!contentDiv.hasChildNodes()) {
      rows.push([label, '']);
    } else {
      rows.push([label, contentDiv]);
    }
  }

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the tabs container with the table
  tabsContainer.replaceWith(table);
}
