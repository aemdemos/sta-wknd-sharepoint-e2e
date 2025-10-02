/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs element (the tab block root)
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get tab labels from the tablist
  const tabLabels = Array.from(
    tabsRoot.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab')
  ).map((li) => li.textContent.trim());

  // Get tab panels (content)
  const tabPanels = Array.from(
    tabsRoot.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Defensive: Only keep as many panels as labels
  const tabCount = Math.min(tabLabels.length, tabPanels.length);

  // Build rows: header, then [label, content] for each tab
  const headerRow = ['Tabs (tabs23)'];
  const rows = [headerRow];

  for (let i = 0; i < tabCount; i += 1) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    // Defensive: clone the panel content to avoid moving it out of DOM
    // But if possible, just reference the content inside the panel
    // Find the first .contentfragment or its direct children
    let content = null;
    const cf = panel.querySelector('.contentfragment, .cmp-contentfragment');
    if (cf) {
      // Use all children except the title h3
      const cfChildren = Array.from(cf.children).filter(
        (child) => !(child.tagName === 'H3' && child.classList.contains('cmp-contentfragment__title'))
      );
      // If only one child, use it directly; else, use array
      content = cfChildren.length === 1 ? cfChildren[0] : cfChildren;
    } else {
      // Fallback: use all children of panel
      const panelChildren = Array.from(panel.children);
      content = panelChildren.length === 1 ? panelChildren[0] : panelChildren;
    }
    rows.push([label, content]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabsRoot with the table
  tabsRoot.replaceWith(table);
}
