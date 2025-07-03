/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root (either direct or via a wrapper)
  let tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get the tab labels from the tablist
  const tabList = tabsRoot.querySelector('[role="tablist"]');
  if (!tabList) return;
  const tabLabelEls = Array.from(tabList.children);
  const tabLabels = tabLabelEls.map(li => li.textContent.trim());

  // Get all panels, in order
  const panels = Array.from(tabsRoot.querySelectorAll('[role="tabpanel"]'));

  // Build header row
  const headerRow = ['Tabs (tabs13)'];
  const cells = [headerRow];

  // Collect tab rows: label, content
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    // Find corresponding panel by aria-controls
    const tabEl = tabLabelEls[i];
    let panelId = tabEl.getAttribute('aria-controls');
    let panelEl = panels.find(p => p.id === panelId);
    if (!panelEl) panelEl = panels[i]; // fallback by order

    // For the content: get all element children
    let contentElements = [];
    if (panelEl) {
      // Use all direct children (can be divs, articles, etc.)
      contentElements = Array.from(panelEl.children).filter(child => {
        // Hide empty grid structure divs
        if (
          child.classList.contains('aem-Grid') ||
          child.classList.contains('aem-Grid--12') ||
          child.classList.contains('aem-Grid--default--12')
        ) {
          return false;
        }
        return true;
      });
      // If no element children, check for text nodes (e.g., <p> inside panel)
      if (contentElements.length === 0) {
        // Check for text or direct HTML (such as <p> or <ul> directly in panel)
        contentElements = Array.from(panelEl.childNodes).filter(n => {
          // element nodes that are not utility wrappers
          if (n.nodeType === 1) return true;
          // text nodes with visible content
          if (n.nodeType === 3 && n.textContent.trim()) return true;
          return false;
        });
      }
    }
    // Use a fragment if more than one, or just the single element if one
    let contentCell;
    if (contentElements.length === 1) {
      contentCell = contentElements[0];
    } else if (contentElements.length > 1) {
      const frag = document.createDocumentFragment();
      contentElements.forEach(el => frag.appendChild(el));
      contentCell = frag;
    } else {
      contentCell = '';
    }
    cells.push([label, contentCell]);
  }

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
