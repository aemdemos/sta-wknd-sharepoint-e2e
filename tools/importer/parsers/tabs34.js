/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block (look for cmp-tabs)
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get tab labels from the tablist
  const tabLabels = Array.from(
    tabsRoot.querySelectorAll('.cmp-tabs__tablist > li[role="tab"]')
  );

  // Get tab panels (content)
  const tabPanels = Array.from(
    tabsRoot.querySelectorAll('[role="tabpanel"]')
  );

  // Defensive: Only keep panels that match labels
  const rows = [];
  const headerRow = ['Tabs (tabs34)'];

  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    if (!label || !panel) continue;

    // Tab label text
    const tabLabel = label.textContent.trim();

    // Tab content: gather all children of panel
    // Defensive: If panel contains a single contentfragment, use its content
    let tabContent;
    const cf = panel.querySelector('article.cmp-contentfragment');
    if (cf) {
      tabContent = cf;
    } else {
      // Otherwise, use all children
      tabContent = Array.from(panel.childNodes).filter(
        (n) => n.nodeType === 1 // element nodes
      );
      // If only one element, use it directly
      if (tabContent.length === 1) tabContent = tabContent[0];
    }

    rows.push([tabLabel, tabContent]);
  }

  // Compose table
  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(block);
}
