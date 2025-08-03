/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs block
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get all tab labels
  const tabLabels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get all tab panels (in order)
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Build the table structure
  // Header row: exactly one cell ['Tabs (tabs3)']
  const cells = [['Tabs (tabs3)']];

  // For each tab, add a row with two columns: label, content
  for (let i = 0; i < tabLabels.length && i < tabPanels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];

    // Find the main contentfragment/article from the panel (if exists)
    let tabContent = [];
    if (panel) {
      const article = panel.querySelector('article');
      if (article) {
        // Get all children except a .cmp-contentfragment__title that matches the label
        const children = Array.from(article.children).filter(child => {
          if (child.classList && child.classList.contains('cmp-contentfragment__title')) {
            // Skip the title if it matches the tab label
            return child.textContent.trim().toLowerCase() !== label.toLowerCase();
          }
          return true;
        });
        // If only one child and it's cmp-contentfragment__elements, flatten its children
        if (
          children.length === 1 &&
          children[0].classList &&
          children[0].classList.contains('cmp-contentfragment__elements')
        ) {
          tabContent = Array.from(children[0].children).filter(el => {
            // Ignore empty grid wrappers
            if (el.classList && el.classList.contains('aem-Grid') && el.children.length === 0) return false;
            if (el.tagName === 'DIV' && el.textContent.trim() === '' && el.children.length === 0) return false;
            return true;
          });
        } else {
          tabContent = children;
        }
      } else {
        // Fallback: all children of panel
        tabContent = Array.from(panel.children).filter(el => el.textContent.trim() !== '');
      }
    }
    // Remove empty wrappers
    tabContent = tabContent.filter(node => {
      if (!node) return false;
      if (node.nodeType !== 1) return false;
      if (node.tagName === 'DIV' && node.textContent.trim() === '' && node.children.length === 0) return false;
      return true;
    });
    // Fallback: if nothing, use the panel itself
    if (tabContent.length === 0 && panel) tabContent = [panel];

    cells.push([label, tabContent.length === 1 ? tabContent[0] : tabContent]);
  }

  // Create the table and replace the element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
