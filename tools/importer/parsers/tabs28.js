/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root by class
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get all tab labels (li elements)
  const tabLabels = Array.from(
    tabsRoot.querySelectorAll('.cmp-tabs__tablist > li')
  );

  // Get all corresponding tab panels
  const tabPanels = Array.from(
    tabsRoot.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Header row: matches example exactly
  const headerRow = ['Tabs (tabs28)'];
  const rows = [headerRow];

  // For each tab, create a row with [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i]?.textContent?.trim() || '';
    const panel = tabPanels[i];
    let contentCell;
    if (panel) {
      // Reference the content block from panel
      // Prefer cmp-contentfragment if present
      const cf = panel.querySelector('.cmp-contentfragment');
      if (cf) {
        // Use a fragment to preserve all children, reference existing elements
        const frag = document.createDocumentFragment();
        Array.from(cf.childNodes).forEach((node) => {
          frag.appendChild(node);
        });
        contentCell = frag;
      } else {
        // If no contentfragment, reference panel's children
        const frag = document.createDocumentFragment();
        Array.from(panel.childNodes).forEach((node) => {
          frag.appendChild(node);
        });
        contentCell = frag;
      }
    } else {
      // Panel missing, fallback to empty string
      contentCell = '';
    }
    rows.push([label, contentCell]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace tabs block with table
  tabsRoot.replaceWith(table);
}
