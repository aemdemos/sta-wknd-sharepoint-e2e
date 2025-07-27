/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs container within the element
  const tabsEl = element.querySelector('.cmp-tabs');
  if (!tabsEl) return;

  // Get all tab labels (in display order)
  const tabLabels = Array.from(tabsEl.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get all tab panels (in display order)
  const tabPanels = Array.from(tabsEl.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Defensive: skip if labels and panels don't match
  if (tabLabels.length !== tabPanels.length) return;

  // Build the rows for the table
  const headerRow = ['Tabs (tabs20)'];
  const rows = [headerRow];

  for (let i = 0; i < tabLabels.length; i += 1) {
    const label = tabLabels[i];
    const panel = tabPanels[i];

    // The displayed tab label text
    const tabName = label.textContent.trim();

    // For tab content, try to get the main content fragment or use all children of the tabpanel
    let tabContent = [];
    // Prefer the first .contentfragment or .cmp-contentfragment in the tabpanel
    const cf = panel.querySelector('.cmp-contentfragment, .contentfragment');
    if (cf) {
      tabContent.push(cf);
    } else {
      // Otherwise, gather all direct children except empty grids
      const children = Array.from(panel.children).filter(child => {
        // Filter out empty grid containers
        if (child.classList.contains('aem-Grid') && !child.textContent.trim()) {
          return false;
        }
        return child.textContent.trim().length > 0 || child.querySelector('img, ul, ol, p, h1, h2, h3, h4, h5, h6');
      });
      if (children.length > 0) {
        tabContent = children;
      } else {
        // fallback to all non-empty childNodes (includes text nodes)
        tabContent = Array.from(panel.childNodes).filter(n => n.textContent && n.textContent.trim().length > 0);
      }
      // If still no content, just reference the panel
      if (tabContent.length === 0) {
        tabContent = [panel];
      }
    }
    rows.push([tabName, tabContent]);
  }

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
