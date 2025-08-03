/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root within the provided element
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Gather tab labels and tab panels
  const tabLabelElements = Array.from(
    tabsRoot.querySelectorAll('.cmp-tabs__tablist > li')
  );
  const tabPanels = Array.from(
    tabsRoot.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]')
  );

  // Build header row exactly as required
  const headerRow = ['Tabs (tabs38)'];
  const cells = [headerRow];

  // For each tab label, match the corresponding tab panel
  for (let i = 0; i < tabLabelElements.length; i++) {
    const labelElem = tabLabelElements[i];
    let label = labelElem ? labelElem.textContent.trim() : '';
    let panel = null;
    // Try to match tab and tabpanel by aria-controls
    if (labelElem && labelElem.hasAttribute('aria-controls')) {
      panel = tabsRoot.querySelector(`#${labelElem.getAttribute('aria-controls')}`);
    }
    // Fallback: by order
    if (!panel && tabPanels[i]) {
      panel = tabPanels[i];
    }
    
    // For tab content, extract the main content from within panel
    let tabContent = null;
    if (panel) {
      // Usually contentfragment > article > .cmp-contentfragment__elements
      let cf = panel.querySelector('.cmp-contentfragment__elements');
      if (cf) {
        tabContent = cf;
      } else {
        // fallback: any content between .contentfragment > article
        let art = panel.querySelector('article');
        if (art) {
          tabContent = art;
        } else {
          // fallback: use the panel itself
          tabContent = panel;
        }
      }
    }
    // Only add a row if both label and content are available
    if (label && tabContent) {
      cells.push([label, tabContent]);
    }
  }

  // Only build the block if there's at least one tab
  if (cells.length > 1) {
    const block = WebImporter.DOMUtils.createTable(cells, document);
    // Replace the original tabs block root with the block table
    tabsRoot.replaceWith(block);
  }
}
