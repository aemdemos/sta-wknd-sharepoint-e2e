/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root
  const tabsRoot = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  if (!tabsRoot) return;

  // Find tab labels (in tablist)
  const tabLabels = Array.from(
    tabsRoot.querySelectorAll('.cmp-tabs__tablist > li[role="tab"]')
  ).map(tab => tab.textContent.trim());

  // Find tab panels (content)
  const tabPanels = Array.from(
    tabsRoot.querySelectorAll('[role="tabpanel"]')
  );

  // Defensive: ensure tab count matches
  if (tabLabels.length !== tabPanels.length) {
    // Try to recover by matching aria-controls
    const tabPanelMap = {};
    tabPanels.forEach(panel => {
      tabPanelMap[panel.getAttribute('aria-labelledby')] = panel;
    });
    // Rebuild tabPanels array in tab order
    const orderedPanels = tabLabels.map((_, i) => {
      const tab = tabsRoot.querySelectorAll('.cmp-tabs__tablist > li[role="tab"]')[i];
      return tabPanelMap[tab.id] || null;
    });
    // Replace tabPanels if all found
    if (orderedPanels.every(Boolean)) tabPanels.splice(0, tabPanels.length, ...orderedPanels);
  }

  // Check for model in tab panels (for HTML comments)
  function getModelFields(panel) {
    // Look for a contentfragment/article with a model
    const cf = panel.querySelector('[data-cmp-contentfragment-model]');
    if (!cf) return null;
    // Try to get field names from data-cmp-data-layer
    try {
      const data = JSON.parse(cf.getAttribute('data-cmp-data-layer'));
      const key = Object.keys(data)[0];
      const elements = data[key].elements;
      if (Array.isArray(elements)) {
        return elements.map(e => e.xdm.title).filter(Boolean);
      }
    } catch(e) {}
    return null;
  }

  // Build the table rows
  const rows = [];
  // Header row
  rows.push(['Tabs (tabs35)']);

  // Each tab: [Label, Content]
  tabLabels.forEach((label, i) => {
    const panel = tabPanels[i];
    if (!panel) return;
    // For robustness, grab all direct children of the panel
    // Usually a contentfragment/article, but could be any structure
    const contentEls = [];
    // If the panel has only one child, use it directly
    if (panel.children.length === 1) {
      contentEls.push(panel.children[0]);
    } else {
      Array.from(panel.childNodes).forEach(node => {
        if (node.nodeType === 1) contentEls.push(node);
        else if (node.nodeType === 3 && node.textContent.trim()) {
          const span = document.createElement('span');
          span.textContent = node.textContent;
          contentEls.push(span);
        }
      });
    }
    // If model fields exist, prepend HTML comment
    const fields = getModelFields(panel);
    if (fields && fields.length) {
      const comment = document.createComment('fields: ' + fields.join(', '));
      contentEls.unshift(comment);
    }
    rows.push([label, contentEls]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block element
  tabsRoot.replaceWith(block);
}
