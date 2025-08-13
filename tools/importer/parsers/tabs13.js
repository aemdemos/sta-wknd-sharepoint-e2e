/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get all tab labels
  const tabLabels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get all tab panels (in order)
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Defensive: Only as many rows as there are both labels and panels
  const tabCount = Math.min(tabLabels.length, tabPanels.length);

  // Header row (exactly one cell)
  const headerRow = ['Tabs (tabs13)'];

  // Each tab: [label, content]
  const rows = [];
  for (let i = 0; i < tabCount; i++) {
    const labelCell = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];
    let contentCell = [];
    // Try to get the main content area (as robustly as possible)
    const frag = panel.querySelector('article.cmp-contentfragment');
    if (frag) {
      const fragElements = frag.querySelector('.cmp-contentfragment__elements');
      if (fragElements) {
        // Most content is in .cmp-contentfragment__elements, but filter layout grids
        const children = Array.from(fragElements.children).filter(child => {
          // Remove grid-only layout divs
          if (child.classList.contains('aem-Grid')) return false;
          return true;
        });
        // If any children left, use them; else whole fragment
        if (children.length > 0) {
          contentCell = children;
        } else {
          contentCell = [frag];
        }
      } else {
        contentCell = [frag];
      }
    } else {
      contentCell = [panel];
    }
    rows.push([labelCell, contentCell]);
  }

  // Compose the final table as [headerRow, ...rows]
  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
