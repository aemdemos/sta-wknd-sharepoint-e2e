/* global WebImporter */
export default function parse(element, { document }) {
  // Helper function to deeply remove empty aem-Grid wrappers
  function cleanContent(node) {
    // If the node is a div with aem-Grid class and is empty or only contains empty aem-Grid divs, skip it
    if (
      node.nodeType === Node.ELEMENT_NODE &&
      node.classList &&
      node.classList.contains('aem-Grid')
    ) {
      // If all children are empty aem-Grid divs, skip
      const children = Array.from(node.children);
      if (children.length === 0) return null;
      const filtered = children
        .map(cleanContent)
        .filter(Boolean);
      if (filtered.length === 0) return null;
      // Return a fragment of filtered children
      const frag = document.createDocumentFragment();
      filtered.forEach(child => frag.appendChild(child));
      return frag;
    }
    // For other nodes, clone and clean their children
    const clone = node.cloneNode(false);
    if (node.childNodes.length) {
      node.childNodes.forEach(child => {
        const cleaned = cleanContent(child);
        if (cleaned) {
          clone.appendChild(cleaned);
        }
      });
    }
    return clone;
  }

  // Find the .cmp-tabs block
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels in order
  const tabLabels = Array.from(
    tabsBlock.querySelectorAll('.cmp-tabs__tablist > li')
  ).map(tab => tab.textContent.trim());

  // Get tab panels in order
  const tabPanels = Array.from(
    tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]')
  );

  // Prepare table rows
  const rows = [['Tabs (tabs30)']];

  for (let i = 0; i < tabLabels.length; i++) {
    const tabLabel = tabLabels[i];
    const panel = tabPanels[i];
    let tabContentElem = null;
    // Find cmp-contentfragment in the panel
    const contentFragment = panel.querySelector('.cmp-contentfragment');
    if (contentFragment) {
      const cfElements = contentFragment.querySelector('.cmp-contentfragment__elements');
      if (cfElements) {
        // Clean up cfElements of any empty grid wrappers
        const cleaned = cleanContent(cfElements);
        tabContentElem = cleaned || cfElements;
      } else {
        tabContentElem = cleanContent(contentFragment) || contentFragment;
      }
    } else {
      tabContentElem = cleanContent(panel) || panel;
    }
    rows.push([tabLabel, tabContentElem]);
  }

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
