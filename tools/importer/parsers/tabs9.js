/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs block within the element
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get tab labels in order
  const tabLabels = Array.from(tabsRoot.querySelectorAll('.cmp-tabs__tablist > li')).map(li => li.textContent.trim());

  // Get all tab panels (order is important, matches tabLabels)
  const tabPanels = Array.from(tabsRoot.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Compose table header and rows
  const headerRow = ['Tabs (tabs9)'];
  const rows = [];
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    let content = null;
    if (panel) {
      // For resilience, grab all child content of the panel
      const fragment = document.createDocumentFragment();
      // Prefer contentfragment/article if exists, else all direct children
      const cf = panel.querySelector('article');
      if (cf) {
        fragment.appendChild(cf);
      } else {
        // Append all children (could be text nodes and elements)
        Array.from(panel.childNodes).forEach(child => {
          fragment.appendChild(child);
        });
      }
      content = fragment.childNodes.length === 1 ? fragment.firstChild : Array.from(fragment.childNodes);
    }
    rows.push([label, content]);
  }

  // Create the table with the required structure
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  
  // Replace the tabs block with the new table
  tabsRoot.replaceWith(table);
}
