/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cmp-tabs element (the tab block)
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels (li elements in the tablist)
  const tablist = tabsBlock.querySelector('.cmp-tabs__tablist');
  const tabLabels = Array.from(tablist ? tablist.querySelectorAll('li') : []);

  // Get all tabpanels (one per tab)
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Build the table rows
  // The first row is a single cell (header row)
  const rows = [ ['Tabs (tabs13)'] ];

  // Subsequent rows: each has two cells, label and content
  for (let i = 0; i < tabLabels.length; i++) {
    // Get label text
    const label = tabLabels[i]?.textContent?.trim() || '';
    // Get content panel (match by order)
    const panel = tabPanels[i];
    let panelContent;
    if (panel) {
      // Try to find a contentfragment
      const contentFragment = panel.querySelector('article.cmp-contentfragment');
      if (contentFragment) {
        panelContent = contentFragment;
      } else {
        // Move all children of panel into a fragment
        const frag = document.createDocumentFragment();
        while (panel.firstChild) {
          frag.appendChild(panel.firstChild);
        }
        panelContent = frag;
      }
    } else {
      panelContent = document.createTextNode('');
    }
    rows.push([label, panelContent]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element with the block
  element.replaceWith(block);
}
