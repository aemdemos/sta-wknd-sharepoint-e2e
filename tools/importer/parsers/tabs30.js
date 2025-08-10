/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the tabs block within the element
  const tabsBlock = element.querySelector('.tabs .cmp-tabs');
  if (!tabsBlock) return;

  // Header row as seen in example
  const headerRow = ['Tabs (tabs30)'];

  // Tab labels (in order)
  const tabLabels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tablist > li'));
  // Tab panels (in order)
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Prepare data rows for each tab
  const rows = tabLabels.map((tabLabel, i) => {
    // Tab label text
    const label = tabLabel ? tabLabel.textContent.trim() : '';
    // Tab panel content
    const panel = tabPanels[i];
    let tabContent = [];
    if (panel) {
      // Grab all direct children except empty grids
      const contentFragment = panel.querySelector('article.cmp-contentfragment');
      if (contentFragment) {
        // Remove title (matches the tab title, not the content)
        const title = contentFragment.querySelector('.cmp-contentfragment__title');
        if (title) title.remove();
        // Remove empty grid wrappers
        contentFragment.querySelectorAll('.aem-Grid').forEach(grid => {
          if (!grid.textContent.trim() && !grid.querySelector('img,ul,ol,li,p,h1,h2,h3,h4,h5,h6')) {
            grid.remove();
          }
        });
        // Get non-empty children
        tabContent = Array.from(contentFragment.childNodes).filter(n => {
          // Filter out empty text, and empty divs
          if (n.nodeType === Node.TEXT_NODE) return n.textContent.trim();
          if (n.nodeType === Node.ELEMENT_NODE) {
            if (n.tagName === 'DIV' && !n.textContent.trim()) return false;
            return true;
          }
          return false;
        });
      } else {
        // Fallback: use all non-empty child nodes of panel
        tabContent = Array.from(panel.childNodes).filter(n => {
          if (n.nodeType === Node.TEXT_NODE) return n.textContent.trim();
          if (n.nodeType === Node.ELEMENT_NODE) {
            if (n.tagName === 'DIV' && !n.textContent.trim()) return false;
            return true;
          }
          return false;
        });
      }
    }
    // If only one node, pass it directly; else pass the array
    const contentCell = tabContent.length === 1 ? tabContent[0] : tabContent;
    return [label, contentCell];
  });

  // Compose the table data
  const cells = [headerRow, ...rows];
  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the whole tabs block with the new table
  tabsBlock.replaceWith(table);
}
