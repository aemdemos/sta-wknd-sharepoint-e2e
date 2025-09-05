/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs block (the tab container)
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get tab labels from the tablist (ol > li)
  const tabList = tabsRoot.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('li'));

  // Get all tab panels (content)
  const tabPanels = Array.from(tabsRoot.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Defensive: ensure we have matching number of labels and panels
  if (tabLabels.length !== tabPanels.length) return;

  // Table header row (must match block name exactly)
  const headerRow = ['Tabs (tabs36)'];
  const rows = [headerRow];

  // For each tab, add a row: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];

    // Find the main content inside the tab panel
    // Use the panel's children, but preserve all content (including images, lists, headings, etc.)
    // We'll create a fragment to hold the content
    const frag = document.createElement('div');
    // Only copy the relevant content, not the panel wrapper itself
    Array.from(panel.childNodes).forEach(node => {
      // Only append element or text nodes
      if (node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.TEXT_NODE) {
        frag.appendChild(node.cloneNode(true));
      }
    });
    // Remove empty wrappers
    while (frag.childNodes.length === 1 && frag.firstChild.nodeType === Node.ELEMENT_NODE && frag.firstChild.tagName === 'DIV') {
      frag.replaceWith(...frag.childNodes);
    }

    rows.push([label, frag]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block with the table
  tabsRoot.replaceWith(table);
}
