/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs block (the element to be replaced)
  const cmpTabs = element.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Header row as per requirements
  const headerRow = ['Tabs (tabs29)'];
  const rows = [headerRow];

  // Get tab labels (li elements inside ol[role=tablist])
  const tabList = cmpTabs.querySelector('ol.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLis = Array.from(tabList.querySelectorAll('li[role=tab]'));

  // Get tab panels (div[role=tabpanel])
  const tabPanels = Array.from(cmpTabs.querySelectorAll('div[role=tabpanel]'));

  // Defensive: ensure tab labels and panels match
  if (tabLis.length !== tabPanels.length) return;

  // For each tab, extract label and content
  for (let i = 0; i < tabLis.length; i++) {
    const tabLabel = tabLis[i].textContent.trim();
    const tabPanel = tabPanels[i];
    if (!tabPanel) continue;

    // Extract all visible content inside the tabPanel
    // Only reference existing elements, not clone or create new ones
    const contentNodes = Array.from(tabPanel.childNodes).filter(n => {
      // Remove empty text nodes
      if (n.nodeType === Node.TEXT_NODE) return n.textContent.trim().length > 0;
      // Only include elements that are not empty
      if (n.nodeType === Node.ELEMENT_NODE) return n.textContent.trim().length > 0 || n.querySelector('img');
      return false;
    });

    let tabContent;
    if (contentNodes.length === 0) {
      tabContent = '';
    } else if (contentNodes.length === 1) {
      tabContent = contentNodes[0];
    } else {
      // Wrap multiple nodes in a div to preserve structure
      const wrapper = document.createElement('div');
      contentNodes.forEach(node => wrapper.appendChild(node));
      tabContent = wrapper;
    }
    rows.push([tabLabel, tabContent]);
  }

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block with the new table
  cmpTabs.parentElement.replaceWith(table);
}
