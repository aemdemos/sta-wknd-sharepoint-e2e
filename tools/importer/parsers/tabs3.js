/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block within the given element
  const tabsRoot = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  if (!tabsRoot) return;

  // Find the tab labels (should be <li> inside <ol> with role="tablist")
  const tabList = tabsRoot.querySelector('[role="tablist"]');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('[role="tab"]'));

  // Find all tab panels (should be <div> with role="tabpanel")
  const tabPanels = Array.from(tabsRoot.querySelectorAll('[role="tabpanel"]'));

  // Defensive: If labels and panels mismatch, abort
  if (tabLabels.length !== tabPanels.length || tabLabels.length === 0) return;

  // Build the header row with the correct block name
  const headerRow = ['Tabs (tabs3)'];
  const rows = [headerRow];

  // For each tab, add a row: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];

    // Find the main content inside the panel
    // Usually a .contentfragment or similar
    let content = null;
    // Try to find the main contentfragment/article
    content = panel.querySelector('.contentfragment, article, .cmp-contentfragment');
    if (!content) {
      // Fallback: Use all children of panel
      content = document.createElement('div');
      Array.from(panel.childNodes).forEach(node => {
        content.appendChild(node.cloneNode(true));
      });
    }

    // Remove empty grid wrappers inside content (optional, for cleaner output)
    Array.from(content.querySelectorAll('.aem-Grid, .aem-Grid--12, .aem-Grid--default--12')).forEach(el => el.remove());

    // Remove empty divs
    Array.from(content.querySelectorAll('div')).forEach(div => {
      if (!div.textContent.trim() && div.children.length === 0) div.remove();
    });

    rows.push([label, content]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block with the block table
  tabsRoot.replaceWith(block);
}
