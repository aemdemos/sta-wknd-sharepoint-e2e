/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs root element, which contains the tabbed interface
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get the tab labels from the tablist
  const tabList = tabsRoot.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabItems = Array.from(tabList.querySelectorAll('li'));
  const labels = tabItems.map(li => li.textContent.trim());

  // Collect all tab panels in order (should match tab labels)
  const panelSelector = '[data-cmp-hook-tabs="tabpanel"]';
  const tabPanels = Array.from(tabsRoot.querySelectorAll(panelSelector));
  if (!tabPanels.length) return;

  // Create the cells for the block table
  const cells = [];

  // 1. Header row (block name)
  cells.push(['Tabs (tabs38)']);

  // 2. Tab label row (all tab labels)
  cells.push(labels);

  // 3. Tab content row: use the existing main content in each tab panel
  // For each tab panel, collect its children as a fragment, or its child (for a single child)
  const contentRow = tabPanels.map(panel => {
    // For best resilience, use all children of the panel (as they may be block-level)
    if (panel.childNodes.length === 1) {
      // Only one node, return it directly
      return panel.firstElementChild || panel.firstChild;
    } else {
      // More than one, wrap in a fragment
      const frag = document.createDocumentFragment();
      Array.from(panel.childNodes).forEach(child => {
        // Only add nodes that are elements or meaningful text (avoid empty text nodes)
        if (child.nodeType === 1 || (child.nodeType === 3 && child.textContent.trim().length > 0)) {
          frag.appendChild(child);
        }
      });
      return frag;
    }
  });
  cells.push(contentRow);

  // Create the block table using the helper
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original tabsRoot element with the new block table
  tabsRoot.replaceWith(block);
}
