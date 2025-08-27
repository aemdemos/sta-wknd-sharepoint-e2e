/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs block within the given element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get tab labels from the tablist
  const tablist = tabs.querySelector('.cmp-tabs__tablist');
  const tabLabels = [];
  if (tablist) {
    tablist.querySelectorAll('li.cmp-tabs__tab').forEach(li => {
      tabLabels.push(li.textContent.trim());
    });
  }

  // Get all the tab panels in order
  const tabPanels = Array.from(tabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // If no labels or panels, do not proceed
  if (!tabLabels.length || !tabPanels.length) return;

  // Compose the header row with the correct title
  const headerRow = ['Tabs (tabs14)'];

  // Prepare the rows for each tab: [label, content]
  const tabRows = tabPanels.map((panel, idx) => {
    // Defensive: Prevent out-of-bounds issues for labels/panels
    const label = tabLabels[idx] || '';

    // For content: try to find a significant block inside each panel
    // Prefer using the article.cmp-contentfragment (to avoid including tabpanel container structure)
    let tabContentBlock = null;
    const contentFragment = panel.querySelector('article.cmp-contentfragment');
    if (contentFragment) {
      tabContentBlock = contentFragment;
    } else {
      // Otherwise, just use all childNodes of the panel (excluding empty whitespace)
      // Create a fragment and append all non-empty nodes
      const frag = document.createDocumentFragment();
      Array.from(panel.childNodes).forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE || (node.nodeType === Node.TEXT_NODE && node.textContent.trim())) {
          frag.appendChild(node);
        }
      });
      tabContentBlock = frag;
    }
    return [label, tabContentBlock];
  });

  const cells = [headerRow, ...tabRows];

  // Create the block table and replace the tabs element only (not the whole container)
  const block = WebImporter.DOMUtils.createTable(cells, document);
  tabs.replaceWith(block);
}
