/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs element within the provided element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Compose the block header row as specified in the prompt
  const cells = [['Tabs (tabs29)']];

  // Get tab labels from the tablist, in order of appearance
  const tabLabels = [];
  const tablist = tabs.querySelector('.cmp-tabs__tablist');
  if (tablist) {
    tablist.querySelectorAll('[role="tab"]').forEach(tab => {
      const label = tab.textContent.trim();
      tabLabels.push(label);
    });
  }

  // Get tab panels in order (should match tabLabels order)
  // Only consider direct children that are tabpanels for order consistency
  const tabPanels = [];
  tabs.childNodes.forEach(child => {
    if (
      child.nodeType === 1 && // element node
      child.getAttribute('role') === 'tabpanel' &&
      child.classList.contains('cmp-tabs__tabpanel')
    ) {
      tabPanels.push(child);
    }
  });
  // Fallback: if above doesn't find panels (due to source variation), use selector
  if (tabPanels.length !== tabLabels.length) {
    const foundPanels = Array.from(tabs.querySelectorAll(':scope > [role="tabpanel"]'));
    if (foundPanels.length === tabLabels.length) {
      tabPanels.length = 0;
      foundPanels.forEach(p => tabPanels.push(p));
    }
  }
  // Defensive: ensure we have the same number of tab panels as tab labels
  const numTabs = Math.min(tabLabels.length, tabPanels.length);

  // For each tab, create a [label, content] row
  for (let i = 0; i < numTabs; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    let contentElem = null;
    // Prefer to reference the main content fragment in the panel
    const contentFragment = panel.querySelector('.cmp-contentfragment, .contentfragment');
    if (contentFragment) {
      contentElem = contentFragment;
    } else {
      // If not present, use all children of the panel
      if (panel.children.length === 1) {
        contentElem = panel.children[0];
      } else {
        // Wrap all panel children in a div for grouping
        const wrapper = document.createElement('div');
        Array.from(panel.childNodes).forEach(n => wrapper.appendChild(n));
        contentElem = wrapper;
      }
    }
    cells.push([label, contentElem]);
  }

  // Build the block table and replace the original .cmp-tabs element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  tabs.replaceWith(block);
}
