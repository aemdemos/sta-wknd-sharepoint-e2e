/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get tab labels (li elements inside ol.cmp-tabs__tablist)
  const tabList = tabsRoot.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabelEls = Array.from(tabList.querySelectorAll('li'));

  // Map tabpanel id -> tabpanel element
  const panelsById = {};
  const tabPanels = Array.from(tabsRoot.querySelectorAll('.cmp-tabs__tabpanel'));
  tabPanels.forEach(panel => {
    if (panel.id) {
      panelsById[panel.id] = panel;
    }
  });

  // Build the table rows
  // Header row: single column
  const rows = [['Tabs (tabs34)']];

  // Each row: [tab label, tab content]
  tabLabelEls.forEach((li) => {
    // Tab label as string, wrapped in <strong>
    const labelStrong = document.createElement('strong');
    labelStrong.textContent = li.textContent.trim();

    // Get corresponding tab content
    let content = '';
    const controls = li.getAttribute('aria-controls');
    if (controls && panelsById[controls]) {
      // Prefer .cmp-contentfragment if present
      const cf = panelsById[controls].querySelector('.cmp-contentfragment');
      if (cf) {
        content = cf;
      } else {
        // fallback: use all children of the tabpanel (to avoid including the panel wrapper)
        content = Array.from(panelsById[controls].childNodes).filter(node =>
          node.nodeType === Node.ELEMENT_NODE || (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== '')
        );
        if (content.length === 1) content = content[0];
        else if (content.length > 1) content = content;
        else content = '';
      }
    }
    rows.push([labelStrong, content]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the table
  element.replaceWith(table);
}
