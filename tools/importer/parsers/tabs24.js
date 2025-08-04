/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs block within the given element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Tabs header
  const headerRow = ['Tabs (tabs24)'];
  const rows = [headerRow];

  // Get all tab labels (li inside .cmp-tabs__tablist)
  const tabLabelEls = Array.from(tabs.querySelectorAll('.cmp-tabs__tablist > li'));

  // Get all tab panels
  // Only panels that have a corresponding tab label will be used
  const tabPanels = Array.from(tabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // It is possible there is a mismatch in count. Only use as many as both exist.
  const count = Math.min(tabLabelEls.length, tabPanels.length);
  for (let i = 0; i < count; i++) {
    // Tab label: plain text
    const tabLabel = tabLabelEls[i].textContent.trim();

    // Tab panel content: try to extract the actual visible content (not the wrapper)
    const panel = tabPanels[i];
    // Content fragment/article inside the panel
    let content = null;
    // Prefer .contentfragment or article inside
    const preferredContent = panel.querySelector('.contentfragment, article');
    if (preferredContent) {
      // Use the actual content fragment/article for tab content
      content = preferredContent;
    } else {
      // Fallback: Use all the children of the panel
      // Put children into a fragment to keep references
      const frag = document.createDocumentFragment();
      for (const child of Array.from(panel.childNodes)) {
        frag.appendChild(child);
      }
      content = frag;
    }
    rows.push([tabLabel, content]);
  }

  // Create the table block using WebImporter.DOMUtils.createTable
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabs root element with the structured block
  tabs.replaceWith(block);
}
