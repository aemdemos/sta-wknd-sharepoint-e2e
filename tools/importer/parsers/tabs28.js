/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs container
  const tabsContainer = element.querySelector('.tabs .cmp-tabs');
  if (!tabsContainer) return;

  // Get tab labels from the tablist
  const tabList = tabsContainer.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('.cmp-tabs__tab'));

  // Get all tab panels (content)
  const tabPanels = Array.from(tabsContainer.querySelectorAll('[role="tabpanel"]'));

  // Defensive: Only proceed if we have the same number of labels and panels
  if (tabLabels.length !== tabPanels.length) return;

  // Table header row (block name)
  const headerRow = ['Tabs (tabs28)'];
  const rows = [headerRow];

  // For each tab, extract label and content
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];

    // For content: grab all children of the tabpanel div (not the tabpanel itself)
    // We'll wrap them in a fragment for robust referencing
    const frag = document.createDocumentFragment();
    Array.from(panel.childNodes).forEach((node) => {
      // Only append element or text nodes
      if (node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.TEXT_NODE) {
        frag.appendChild(node.cloneNode(true));
      }
    });

    rows.push([label, frag]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original tabs container with the new table
  tabsContainer.replaceWith(table);
}
