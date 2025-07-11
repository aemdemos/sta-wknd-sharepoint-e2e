/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs container in the given element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get the tab labels (order matters)
  const tabLabelElements = Array.from(
    tabs.querySelectorAll('.cmp-tabs__tablist .cmp-tabs__tab')
  );

  // Get all tab panels (these map to tab content by aria-controls)
  const tabPanels = Array.from(
    tabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]')
  );

  // Prepare the block rows
  const rows = [];
  // Header row must match exactly as per requirements
  rows.push(['Tabs (tabs6)']);

  // For edge cases, create a map of id -> panel
  const panelMap = {};
  tabPanels.forEach(panel => {
    panelMap[panel.id] = panel;
  });

  // For each tab label, pair with its content panel
  tabLabelElements.forEach(labelEl => {
    const label = labelEl.textContent.trim();
    let panel = null;
    const controlsId = labelEl.getAttribute('aria-controls');
    if (controlsId && panelMap[controlsId]) {
      panel = panelMap[controlsId];
    }
    // Fallback: try to match by index if no aria-controls (shouldn't happen, but just in case)
    if (!panel) {
      const idx = tabLabelElements.indexOf(labelEl);
      if (tabPanels[idx]) panel = tabPanels[idx];
    }

    // Extract the content for the tab:
    // Usually, it's the entire .contentfragment or .cmp-contentfragment inside the panel
    let content = null;
    if (panel) {
      // Try to find the first .contentfragment or .cmp-contentfragment
      const cf = panel.querySelector('.contentfragment, .cmp-contentfragment');
      if (cf) {
        content = cf;
      } else {
        // If not found, collect all visible, meaningful children
        const children = Array.from(panel.children).filter(child => {
          if (child.tagName === 'SCRIPT' || child.tagName === 'STYLE') return false;
          if (child.hasAttribute('hidden') || child.style.display === 'none') return false;
          // skip empty divs
          if (child.tagName === 'DIV' && child.innerHTML.trim() === '') return false;
          return true;
        });
        if (children.length === 1) {
          content = children[0];
        } else if (children.length > 1) {
          content = children;
        }
      }
    }
    // Fallback to the panel itself if everything else fails
    if (!content && panel) content = panel;
    rows.push([label, content]);
  });

  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.parentNode.replaceChild(block, element);
}
