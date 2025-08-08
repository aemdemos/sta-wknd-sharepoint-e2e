/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the .cmp-tabs block inside the element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get all tab labels (as <li> in .cmp-tabs__tablist)
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  const tabLabels = Array.from(tabList ? tabList.children : []);

  // Get all tab panels (in DOM order)
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Header row: exactly as block name
  const headerRow = ['Tabs (tabs37)'];

  // Compose table rows: each row is [label, content]
  const rows = [];
  for (let i = 0; i < tabLabels.length && i < tabPanels.length; i += 1) {
    const labelText = tabLabels[i].textContent.trim();
    // Use a <strong> element for tab label as in most tab UI (optional, but matches style)
    const labelElem = document.createElement('strong');
    labelElem.textContent = labelText;

    // Try to find the main article (contentfragment) inside the tab panel
    const panel = tabPanels[i];
    let contentElem = null;
    const cf = panel.querySelector('article.cmp-contentfragment');
    if (cf) {
      // The main content is usually inside .cmp-contentfragment__elements
      const cfEls = cf.querySelector('.cmp-contentfragment__elements');
      if (cfEls) {
        // For robustness, gather all direct children of .cmp-contentfragment__elements
        const contentParts = [];
        Array.from(cfEls.children).forEach(child => {
          // Skip empty grid containers
          if (
            child.classList.contains('aem-Grid') &&
            child.children.length === 0
          ) return;
          // Skip grid containers with only empty content
          if (child.classList.contains('aem-Grid') && child.children.length > 0) {
            // Check if all children are empty
            const allEmpty = Array.from(child.children).every(grandchild => grandchild.innerHTML.trim() === '');
            if (allEmpty) return;
          }
          contentParts.push(child);
        });
        // If nothing found, as fallback use the .cmp-contentfragment__elements itself
        contentElem = contentParts.length > 0 ? contentParts : cfEls;
      } else {
        // Fallback to entire article
        contentElem = cf;
      }
    } else {
      // Fallback: use panel itself
      contentElem = panel;
    }
    rows.push([labelElem, contentElem]);
  }

  // Compose the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);

  // Replace the original tabs block with the new table
  tabsBlock.replaceWith(table);
}
