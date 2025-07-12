/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs element (the tab block root)
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get the tab labels (in order)
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  const tabLabels = Array.from(tabList ? tabList.querySelectorAll('[role="tab"]') : []);

  // Each tab corresponds to a tabpanel div in order
  const tabPanels = Array.from(tabs.querySelectorAll('.cmp-tabs__tabpanel'));

  // Build the cells array: first row is the header, then one row per tab (2 columns: label, content)
  const cells = [];
  // Header row: must match block name exactly as in the example
  cells.push(['Tabs (tabs13)']);

  // For each tab, add a row with tab label and tab content
  for (let i = 0; i < tabLabels.length; i++) {
    const labelEl = tabLabels[i];
    let labelText = labelEl.textContent.trim();
    // Construct cell for label (as text)
    const labelCell = labelText;
    // The matching panel by index
    const panel = tabPanels[i];
    let contentCell = null;
    if (panel) {
      // Reference the *existing* elements for the tab content (not cloning, not creating new)
      // We'll combine all direct children of panel into a DocumentFragment
      const frag = document.createDocumentFragment();
      Array.from(panel.childNodes).forEach(child => {
        if (child.nodeType === Node.ELEMENT_NODE || (child.nodeType === Node.TEXT_NODE && child.textContent.trim())) {
          frag.appendChild(child);
        }
      });
      contentCell = frag.childNodes.length === 1 ? frag.firstChild : Array.from(frag.childNodes);
    }
    cells.push([labelCell, contentCell]);
  }

  // Create the table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the tabs element with the new block
  tabs.replaceWith(block);
}
