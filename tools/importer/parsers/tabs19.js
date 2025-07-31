/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs element inside the provided element
  const tabsEl = element.querySelector('.cmp-tabs');
  if (!tabsEl) return;

  // Get all tab labels from the tablist
  const tabLabels = Array.from(
    tabsEl.querySelectorAll('.cmp-tabs__tablist > li')
  );

  // Get all tab panels
  const tabPanels = Array.from(
    tabsEl.querySelectorAll('div[data-cmp-hook-tabs="tabpanel"]')
  );

  // Only proceed if tab count matches panel count and is > 0
  if (
    !tabLabels.length ||
    !tabPanels.length ||
    tabLabels.length !== tabPanels.length
  ) {
    return;
  }

  // Table header, per spec (block name and variant)
  const headerRow = ['Tabs (tabs19)'];
  const cells = [headerRow];

  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];
    // The content is the .contentfragment element inside the tabpanel (if present), else everything inside tabpanel
    let contentRoot = panel.querySelector(':scope > .contentfragment') || panel;
    // We want only the main visible/meaningful children (strip aem-Grid wrappers)
    let contentElements = Array.from(contentRoot.childNodes)
      .filter((n) => {
        // Remove empty text nodes
        if (n.nodeType === 3) return n.textContent.trim().length > 0;
        // Remove aem-Grid wrappers
        if (n.nodeType === 1 && n.classList && n.classList.contains('aem-Grid')) return false;
        // Remove empty elements
        if (n.nodeType === 1 && n.textContent.trim().length === 0) return false;
        return true;
      });
    // If the only child is cmp-contentfragment__elements, dig inside it
    if (
      contentElements.length === 1 &&
      contentElements[0].nodeType === 1 &&
      contentElements[0].classList &&
      contentElements[0].classList.contains('cmp-contentfragment__elements')
    ) {
      contentElements = Array.from(contentElements[0].childNodes).filter((n) => {
        if (n.nodeType === 3) return n.textContent.trim().length > 0;
        if (n.nodeType === 1 && n.classList && n.classList.contains('aem-Grid')) return false;
        if (n.nodeType === 1 && n.textContent.trim().length === 0) return false;
        return true;
      });
    }
    // If all that's left is whitespace, fallback to main text
    let contentCell;
    if (contentElements.length === 0) {
      contentCell = panel.textContent.trim();
    } else if (contentElements.length === 1) {
      contentCell = contentElements[0];
    } else {
      contentCell = contentElements;
    }
    // Each row: [tab label, tab content]
    cells.push([label, contentCell]);
  }

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
