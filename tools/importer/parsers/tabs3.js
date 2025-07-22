/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs element (the tab block itself)
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get tab labels from the <li> elements in the tablist
  const tablist = tabs.querySelector('.cmp-tabs__tablist');
  if (!tablist) return;
  const tabLabels = Array.from(tablist.querySelectorAll('li'));

  // Find all tab panels: these are .cmp-tabs__tabpanel elements
  const tabPanels = Array.from(tabs.querySelectorAll('.cmp-tabs__tabpanel'));

  // Build the table rows.
  const rows = [];
  // Header row
  rows.push(['Tabs (tabs3)']);

  // For each tab, add a row with: [label, content]
  tabLabels.forEach((tabLabel, i) => {
    // Get the tab label text
    const labelText = tabLabel.textContent.trim();
    // Get the tabpanel for this tab
    // Match by aria-controls/aria-labelledby
    const tabId = tabLabel.getAttribute('aria-controls');
    let panel = tabPanels.find(
      p => p.getAttribute('id') === tabId
    );
    if (!panel) {
      // fallback: just use index
      panel = tabPanels[i];
    }
    // The visible content in the panel is the descendant with class contentfragment
    let tabContent = null;
    if (panel) {
      // If there's only one top-level element, just use it
      const contentFragment = panel.querySelector('.contentfragment');
      if (contentFragment) {
        tabContent = contentFragment;
      } else {
        // fallback: use all panel children except script/style/comments
        const panelContent = Array.from(panel.childNodes).filter(
          node => node.nodeType === 1 || node.nodeType === 3
        );
        tabContent = panelContent.length === 1 ? panelContent[0] : panelContent;
      }
    }
    rows.push([labelText, tabContent]);
  });

  // Create table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the tabs element with the block table
  tabs.parentNode.replaceChild(block, tabs);
}
