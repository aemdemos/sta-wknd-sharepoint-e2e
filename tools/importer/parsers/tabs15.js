/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs root element if not already provided directly
  let tabsEl = element;
  if (!tabsEl.classList.contains('cmp-tabs')) {
    tabsEl = element.querySelector('.cmp-tabs');
  }
  if (!tabsEl) return;

  // Get all tab labels
  const tabLabelEls = tabsEl.querySelectorAll('.cmp-tabs__tablist > li');
  // Get all tabpanel content (matching order)
  const tabPanelEls = tabsEl.querySelectorAll('.cmp-tabs__tabpanel');

  // Defensive: If no tabs or panels, skip
  if (!tabLabelEls.length || !tabPanelEls.length) return;

  // Build header row
  const headerRow = ['Tabs (tabs15)'];

  // For each tab, collect [label, content] row
  const rows = [headerRow];
  for (let i = 0; i < tabLabelEls.length; i++) {
    // Label cell: use the label element, but reference it directly
    const tabLabelEl = tabLabelEls[i];
    // Create a <strong> element with label text, as in the example visual
    const labelStrong = document.createElement('strong');
    labelStrong.textContent = tabLabelEl.textContent.trim();

    // Content cell: for this tab, reference the entire tabpanel content
    // As per instructions, reference the child nodes directly
    const panel = tabPanelEls[i];
    // Most panels have a single <div class="contentfragment"> containing <article>, so just take all children
    // Remove empty .aem-Grid divs (common noise in AEM)
    // Get all visible (non-empty) children
    const contentNodes = Array.from(panel.childNodes).filter(node => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        // Remove .aem-Grid or empty divs
        if (
          node.classList &&
          node.classList.contains('aem-Grid') &&
          !node.textContent.trim()
        ) {
          return false;
        }
        if (
          node.nodeName === 'DIV' &&
          node.classList &&
          node.classList.length === 0 &&
          !node.textContent.trim()
        ) {
          return false;
        }
        // Otherwise, keep
        return true;
      } else if (node.nodeType === Node.TEXT_NODE) {
        // Keep only if text is not just whitespace
        return node.textContent.trim().length > 0;
      }
      return true;
    });
    // If there's only one node, just put it, else array
    rows.push([
      labelStrong,
      contentNodes.length === 1 ? contentNodes[0] : contentNodes
    ]);
  }

  // Create block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
