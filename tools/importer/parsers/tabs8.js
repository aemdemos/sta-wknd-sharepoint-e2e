/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cmp-tabs element in the given element (the block root)
  let tabsEl = element.querySelector('.cmp-tabs');
  if (!tabsEl) return;

  // Find the tab list labels (li's)
  const tabList = tabsEl.querySelector('ol[role="tablist"]');
  if (!tabList) return;
  const tabLis = Array.from(tabList.querySelectorAll('li[role="tab"]'));

  // Find the tab panel elements (these contain each tab's content)
  const tabPanels = Array.from(tabsEl.querySelectorAll('[role="tabpanel"]'));

  // Prepare the header row as in the spec
  const headerRow = ['Tabs (tabs8)'];
  const rows = [headerRow];

  // For each tab, extract its label and corresponding panel content
  tabLis.forEach((tabLi) => {
    const label = tabLi.textContent.trim();
    // Each tab label should have an aria-controls pointing to the corresponding panel
    const ariaControls = tabLi.getAttribute('aria-controls');
    let panel = null;
    if (ariaControls) {
      panel = tabsEl.querySelector(`#${ariaControls}`);
    }
    // Fallback: match by index if not found (shouldn't really happen)
    if (!panel) {
      // Try by index
      const index = tabLis.indexOf(tabLi);
      panel = tabPanels[index];
    }
    if (!panel) return; // Defensive, skip if panel not found

    // Collect all children of the tabpanel (not the role=tabpanel wrapper)
    // But we want to preserve all structure, so put all childNodes as is except for empty whitespace
    const contentNodes = Array.from(panel.childNodes).filter(n => (
      n.nodeType !== 3 || n.textContent.trim() // skip whitespace text nodes
    ));
    let contentCell;
    if (contentNodes.length === 1) {
      contentCell = contentNodes[0];
    } else {
      contentCell = contentNodes;
    }
    rows.push([label, contentCell]);
  });

  // Create the block table using the required helper function
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element with the new block table
  element.replaceWith(block);
}
