/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the tabs root
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Find all top-level tab labels (li elements inside .cmp-tabs__tablist)
  const tabLabelElements = Array.from(
    tabsRoot.querySelectorAll('.cmp-tabs__tablist > li')
  );
  if (!tabLabelElements.length) return;

  // Find all tab panels in visual order (should match tab order)
  const tabPanelElements = Array.from(
    tabsRoot.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]')
  );
  if (!tabPanelElements.length) return;

  // Guard: labels and panels should match
  if (tabLabelElements.length !== tabPanelElements.length) {
    // If they don't match, try to only pair as far as both exist
    const minLen = Math.min(tabLabelElements.length, tabPanelElements.length);
    tabLabelElements.length = minLen;
    tabPanelElements.length = minLen;
  }

  // Compose header row
  const headerRow = ['Tabs (tabs33)'];

  // Compose tab rows
  const tabRows = tabLabelElements.map((labelEl, idx) => {
    // Cell 1: Tab label text
    const labelText = labelEl.textContent.trim();
    // Cell 2: All meaningful content for this panel
    // Use the first <article> under the panel if present, else the panel itself
    const panel = tabPanelElements[idx];
    let contentEl = panel.querySelector('article');
    if (!contentEl) {
      // If no article, use the inner content, but remove empty .aem-Grid wrappers if present
      // (Get all children except empty div.aem-Grid)
      const contentNodes = Array.from(panel.childNodes).filter((n) => {
        if (n.nodeType !== Node.ELEMENT_NODE) return true;
        if (n.classList.contains('aem-Grid') && !n.textContent.trim()) return false;
        return true;
      });
      // If just one node, use it directly, else use array
      contentEl = contentNodes.length === 1 ? contentNodes[0] : contentNodes;
    }
    return [labelText, contentEl];
  });

  // Compose cells array
  const cells = [headerRow, ...tabRows];

  // Create the tabs block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the tabs section with the block
  element.replaceWith(block);
}
