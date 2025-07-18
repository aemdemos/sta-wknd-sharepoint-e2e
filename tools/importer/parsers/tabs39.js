/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block: look for .cmp-tabs within the context
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get all tab labels from tab list (usually li elements in ol.cmp-tabs__tablist)
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabelEls = Array.from(tabList.children);

  // Get all tab panels (div[data-cmp-hook-tabs="tabpanel"])
  const tabPanels = Array.from(tabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Prepare the header row
  const headerRow = ['Tabs (tabs39)'];

  // Prepare the data rows: one per tab
  const rows = tabLabelEls.map((li, idx) => {
    // Get the tab label text (keep formatting if any, but usually just textContent)
    const label = li.textContent.trim();
    // Find the corresponding panel by aria-controls (the tab points to a tabpanel's id)
    const panelId = li.getAttribute('aria-controls');
    let panel = null;
    if (panelId) {
      panel = tabs.querySelector(`#${panelId}`);
    }
    if (!panel) {
      // fallback to index order
      panel = tabPanels[idx] || null;
    }
    // For the content cell: if the panel has a single .contentfragment, use that. Otherwise use the panel itself.
    let contentCell = null;
    if (panel) {
      const contentFragment = panel.querySelector(':scope > .contentfragment, :scope > article.cmp-contentfragment');
      if (contentFragment) {
        contentCell = contentFragment;
      } else {
        // Use all immediate (direct) children except possible empty .aem-Grid wrappers, or empty divs
        // But for robustness, if there are multiple real children, group them into a DocumentFragment
        const directEls = Array.from(panel.children).filter(
          el =>
            !(el.classList.contains('aem-Grid') && el.childElementCount === 0) &&
            !(el.tagName === 'DIV' && el.childElementCount === 0)
        );
        if (directEls.length === 1) {
          contentCell = directEls[0];
        } else if (directEls.length > 1) {
          const frag = document.createDocumentFragment();
          directEls.forEach(el => frag.appendChild(el));
          contentCell = frag;
        } else {
          // fallback: use panel itself
          contentCell = panel;
        }
      }
    }
    return [label, contentCell];
  });

  // Compose the cells array
  const cells = [headerRow, ...rows];

  // Create the table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the tabs element with the new table
  tabs.replaceWith(table);
}
