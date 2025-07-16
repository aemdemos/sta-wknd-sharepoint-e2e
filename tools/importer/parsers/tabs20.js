/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the main tabs container
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get the tab labels in order
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  let tabLabels = [];
  if (tabList) {
    tabLabels = Array.from(tabList.querySelectorAll('[role="tab"]')).map(tab => tab.textContent.trim());
  }

  // Get all tab panels in the source order
  const tabPanels = Array.from(tabs.querySelectorAll('[role="tabpanel"]'));

  // Prepare table rows: first is the header, rest are tab label + tab content
  const cells = [];
  cells.push(['Tabs (tabs20)']); // Header as required

  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    if (!panel) continue; // Defensive: skip if mismatch
    // Find the content block inside the tab panel to preserve all content
    // Use the .contentfragment, or fallback to all panel children if missing
    let tabContent = null;
    const contentFragment = panel.querySelector('.contentfragment');
    if (contentFragment) {
      tabContent = contentFragment;
    } else {
      // Fallback: collect all non-empty element and text nodes
      let panelContent = [];
      panel.childNodes.forEach(n => {
        if (n.nodeType === 1 && n.innerHTML.trim()) {
          panelContent.push(n);
        } else if (n.nodeType === 3 && n.textContent.trim()) {
          const span = document.createElement('span');
          span.textContent = n.textContent;
          panelContent.push(span);
        }
      });
      // If nothing found, just use the panel itself
      tabContent = panelContent.length ? panelContent : panel;
    }
    cells.push([label, tabContent]);
  }

  // Create the block table and replace the original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
