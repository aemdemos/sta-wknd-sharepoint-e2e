/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the .cmp-tabs element, which contains the tabs UI
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get the tab labels from the tablist
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  const tabLabels = Array.from(tabList ? tabList.querySelectorAll('.cmp-tabs__tab') : []);

  // Get all tab panels (content)
  const tabPanels = Array.from(tabs.querySelectorAll('.cmp-tabs__tabpanel'));

  // Prepare block header row
  const cells = [['Tabs (tabs11)']];

  // For each tab, build a row: first cell is the label, second the content
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    // The tab ID
    const tabId = tabLabels[i].id;
    // Find the corresponding tabpanel by aria-labelledby
    const panel = tabPanels.find(
      p => p.getAttribute('aria-labelledby') === tabId
    );
    if (!panel) continue;

    // Extract the tab content: if .contentfragment exists, use it, else the panel
    let content = panel.querySelector('.contentfragment');
    if (!content) {
      // fallback: use all children of the panel, combined
      // create a wrapper div to hold all contents
      const wrapper = document.createElement('div');
      Array.from(panel.childNodes).forEach(node => {
        // Only append non-empty nodes
        if (node.nodeType === Node.ELEMENT_NODE || (node.nodeType === Node.TEXT_NODE && node.textContent.trim())) {
          wrapper.appendChild(node);
        }
      });
      // Use wrapper only if it has content
      content = wrapper.childNodes.length > 0 ? wrapper : document.createTextNode('');
    }
    cells.push([label, content]);
  }

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the tabs element with the table
  tabs.replaceWith(table);
}
