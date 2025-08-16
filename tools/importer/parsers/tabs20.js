/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cmp-tabs block within the given element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Extract tab labels (in order)
  const tabLabels = Array.from(
    tabsBlock.querySelectorAll('.cmp-tabs__tablist > li')
  ).map(l => l.textContent.trim());

  // Extract tab content panels (order matches the labels)
  const tabPanels = Array.from(
    tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]')
  );

  // Compose the header row: single column, block name
  const cells = [['Tabs (tabs20)']];

  // Compose the tab labels row: each label in its own cell (single row)
  cells.push(tabLabels);

  // For each tab, add a new row: [tab label, tab content] (2 columns per row, one row per tab)
  for (let i = 0; i < tabLabels.length; i++) {
    let panelContent;
    const panel = tabPanels[i];
    if (panel) {
      // Reference the full tabpanel content (prefer main child if present)
      if (panel.children.length === 1) {
        panelContent = panel.children[0];
      } else if (panel.children.length > 1) {
        // Use a fragment to collect all children
        const frag = document.createDocumentFragment();
        Array.from(panel.childNodes).forEach(child => {
          if (child.nodeType === 1) frag.appendChild(child);
        });
        panelContent = frag;
      } else {
        // If there are no element children, use the text content
        panelContent = panel.textContent;
      }
    } else {
      panelContent = '';
    }
    cells.push([tabLabels[i], panelContent]);
  }

  const table = WebImporter.DOMUtils.createTable(cells, document);
  tabsBlock.replaceWith(table);
}
