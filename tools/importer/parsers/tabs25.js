/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs root element inside the provided element
  const tabsRoot = element.querySelector('.tabs .cmp-tabs');
  if (!tabsRoot) return;

  // Find all tab labels
  const tabLabels = Array.from(tabsRoot.querySelectorAll('.cmp-tabs__tablist > li'));
  // Find all tab panels (content)
  const tabPanels = Array.from(tabsRoot.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  if (tabLabels.length === 0 || tabPanels.length === 0) return;
  // Defensive: If number of tabs and panels don't match, bail
  if (tabLabels.length !== tabPanels.length) return;

  // 1st row: header row as required by block instructions
  const headerRow = ['Tabs (tabs25)'];

  // 2nd row: tab names (do not wrap in <strong>, per table structure)
  const tabNamesRow = tabLabels.map(tab => tab.textContent.trim());

  // 3rd row: content for each tab, reference the main content block in each tab panel
  const contentRow = tabPanels.map(panel => {
    // For robustness, select only the direct content block (e.g., article.contentfragment)
    // If not found, use the panel itself
    const cf = panel.querySelector('article.cmp-contentfragment');
    if (cf) return cf;
    // fallback: use the direct children except for possible empty grid divs
    // Collect non-empty, non-trivial children
    const children = Array.from(panel.children).filter(el => {
      if (el.tagName === 'DIV' && el.className.includes('aem-Grid')) return false;
      if (!el.textContent.trim() && !el.querySelector('img,ul,ol,iframe')) return false;
      return true;
    });
    if (children.length) return children;
    // fallback: panel itself
    return panel;
  });

  // Compose block table rows: header row, tab names row, content row
  const cells = [];
  cells.push(headerRow); // first row: header
  cells.push(tabNamesRow); // second row: tab labels
  cells.push(contentRow); // third row: tab content elements

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original tabs container with the block table
  tabsRoot.replaceWith(table);
}
