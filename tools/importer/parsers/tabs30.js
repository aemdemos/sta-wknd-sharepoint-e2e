/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root
  const tabsRoot = element.querySelector('.tabs .cmp-tabs');
  if (!tabsRoot) return;

  // Get all tab labels (li elements)
  const tabLabels = Array.from(tabsRoot.querySelectorAll(':scope > ol.cmp-tabs__tablist > li'));

  // Get all tab panels (div[role=tabpanel])
  const tabPanels = Array.from(tabsRoot.querySelectorAll(':scope > div[role="tabpanel"]'));

  // Defensive: Ensure same number of labels and panels
  if (tabLabels.length !== tabPanels.length) return;

  // Header row
  const headerRow = ['Tabs (tabs30)'];
  const rows = [headerRow];

  // For each tab, extract label and content
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];

    // Defensive: If panel is missing, skip
    if (!panel) continue;

    // For tab content, grab all direct children of the panel's .contentfragment > article > .cmp-contentfragment__elements
    // This ensures we get the main content, images, etc., as a single block
    let content = [];
    const contentFragment = panel.querySelector('.contentfragment article .cmp-contentfragment__elements');
    if (contentFragment) {
      // Only get the direct children that are not empty grid wrappers
      const children = Array.from(contentFragment.children).filter(child => {
        // Filter out empty grid wrappers
        if (child.classList.contains('aem-Grid') && child.children.length === 0) return false;
        return true;
      });
      // If there's only one child and it's a wrapper, unwrap its children
      if (children.length === 1 && children[0].children.length > 0) {
        content = Array.from(children[0].children);
      } else {
        content = children;
      }
      // If still empty, fallback to all children
      if (content.length === 0) {
        content = Array.from(contentFragment.children);
      }
    } else {
      // fallback: use all children of panel
      content = Array.from(panel.children);
    }
    // If content is still empty, fallback to panel innerHTML as a div
    if (!content || content.length === 0) {
      const fallbackDiv = document.createElement('div');
      fallbackDiv.innerHTML = panel.innerHTML;
      content = [fallbackDiv];
    }
    // Add row: [label, content]
    rows.push([label, content]);
  }

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabs block with the table
  tabsRoot.replaceWith(table);
}
