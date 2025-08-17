/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root (the one with class 'cmp-tabs')
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get the tab labels (li[role=tab]) in order
  const tabListEl = tabsRoot.querySelector('.cmp-tabs__tablist');
  if (!tabListEl) return;
  const tabEls = Array.from(tabListEl.querySelectorAll('li[role="tab"]'));

  // Prepare header row as specified
  const headerRow = ['Tabs (tabs18)'];
  const cells = [headerRow];

  // For each tab, extract label and panel content
  tabEls.forEach((tabEl) => {
    const tabLabel = tabEl.textContent.trim();
    const tabPanelId = tabEl.getAttribute('aria-controls');
    // Find the corresponding tab panel by id
    const tabPanel = tabsRoot.querySelector(`#${tabPanelId}`);
    if (!tabPanel) return; // skip if not found
    // The SEMANTIC rule: each tab's content is the content inside the tab panel
    // We want to reference the existing children nodes for robustness
    // If there is only one significant child, reference it directly
    // Otherwise, collect all children
    let tabContent;
    // Remove hidden aem-Grid containers if present (empty grid fillers)
    const nodes = Array.from(tabPanel.childNodes).filter(node => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        // Keep nodes that are not empty .aem-Grid containers
        if (node.classList.contains('aem-Grid') && node.childNodes.length === 0) {
          return false;
        }
        return true;
      }
      // Keep text nodes if not empty
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0) {
        return true;
      }
      return false;
    });
    // If only one, use it directly, else array
    if (nodes.length === 1) {
      tabContent = nodes[0];
    } else {
      tabContent = nodes;
    }
    cells.push([tabLabel, tabContent]);
  });

  // Create the block and replace the original element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
