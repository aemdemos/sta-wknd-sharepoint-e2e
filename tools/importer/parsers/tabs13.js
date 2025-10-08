/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  if (!tabsBlock) return;

  // Find the tab navigation (tab labels)
  const tabNav = tabsBlock.querySelector('.cmp-tabs__tablist');
  if (!tabNav) return;
  const tabLabels = Array.from(tabNav.querySelectorAll('.cmp-tabs__tab'));

  // Find all tab panels (content)
  const tabPanels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tabpanel'));

  // Defensive: ensure labels and panels match
  if (tabLabels.length !== tabPanels.length || tabLabels.length === 0) return;

  // Build the table rows
  const rows = [];
  // Header row as specified
  const headerRow = ['Tabs (tabs13)'];
  rows.push(headerRow);

  // Each tab: [Tab Label, Tab Content]
  tabLabels.forEach((tabLabel, idx) => {
    // Tab label text
    const labelText = tabLabel.textContent.trim();
    // Tab panel content
    const tabPanel = tabPanels[idx];
    if (!tabPanel) return;

    // Extract all content from the tab panel, preserving structure
    const frag = document.createDocumentFragment();
    Array.from(tabPanel.childNodes).forEach((node) => {
      if (node.nodeType !== Node.TEXT_NODE || node.textContent.trim()) {
        frag.appendChild(node.cloneNode(true));
      }
    });
    let tabContent;
    if (!frag.childNodes.length) {
      tabContent = tabPanel.textContent.trim();
    } else if (frag.childNodes.length === 1) {
      tabContent = frag.firstChild;
    } else {
      const wrapper = document.createElement('div');
      wrapper.appendChild(frag);
      tabContent = wrapper;
    }
    rows.push([labelText, tabContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original tabs block with the new table
  tabsBlock.replaceWith(block);
}
