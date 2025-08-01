/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs element, either on element or within
  const tabsRoot = element.classList.contains('cmp-tabs') ? element : element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get all tab labels (li[role=tab])
  const tabLabels = Array.from(tabsRoot.querySelectorAll('.cmp-tabs__tablist [role="tab"]'));
  // Get all tab panels (div[role=tabpanel]) - keep order
  const tabPanels = Array.from(tabsRoot.querySelectorAll('[role="tabpanel"]'));

  // Compose rows: header, then tab rows: [Label, PanelContent]
  const rows = [];
  // The header row is always the block name exactly as specified
  rows.push(['Tabs (tabs31)']);

  // For each tab label, find the corresponding tabpanel
  for (let i = 0; i < tabLabels.length; i++) {
    const tab = tabLabels[i];
    const label = tab.textContent.trim();
    // Try to find by aria-controls id
    let panel = null;
    if (tab.hasAttribute('aria-controls')) {
      const ctrl = tab.getAttribute('aria-controls');
      panel = tabsRoot.querySelector(`#${ctrl}`);
    }
    // Fallback: order
    if (!panel && tabPanels[i]) {
      panel = tabPanels[i];
    }
    if (!panel) continue;
    // Find the main content inside the panel: usually a .contentfragment or its main child
    let content = null;
    // Usually the first child (content fragment/article)
    if (panel.children.length === 1 && panel.children[0].tagName.toLowerCase() === 'div' && panel.children[0].classList.contains('contentfragment')) {
      content = panel.children[0];
    } else if (panel.children.length === 1 && panel.children[0].tagName.toLowerCase() === 'article') {
      content = panel.children[0];
    } else {
      // fallback: use the panel itself (should never happen, but for resilience)
      content = panel;
    }
    rows.push([label, content]);
  }

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
