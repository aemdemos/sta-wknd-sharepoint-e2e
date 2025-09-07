/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels
  const tabLabels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get tab panels
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Defensive: Ensure labels and panels match
  if (tabLabels.length !== tabPanels.length || tabLabels.length === 0) return;

  // Header row: must match block name exactly
  const headerRow = ['Tabs (tabs3)'];
  const rows = [headerRow];

  // For each tab, create a row: [label, content]
  tabLabels.forEach((labelEl, i) => {
    const label = labelEl.textContent.trim();
    const panel = tabPanels[i];
    // Find the main content fragment inside the panel
    let contentFragment = panel.querySelector('.contentfragment, .cmp-contentfragment');
    let tabContent;
    if (contentFragment) {
      // Use the content fragment's children (not the wrapper)
      tabContent = Array.from(contentFragment.childNodes).filter(n => n.nodeType !== Node.COMMENT_NODE && (n.textContent.trim() || n.nodeType !== Node.TEXT_NODE));
      if (tabContent.length === 1) tabContent = tabContent[0];
    } else {
      // Fallback: use all children of the panel
      tabContent = Array.from(panel.childNodes).filter(n => n.nodeType !== Node.COMMENT_NODE && (n.textContent.trim() || n.nodeType !== Node.TEXT_NODE));
      if (tabContent.length === 1) tabContent = tabContent[0];
    }
    rows.push([label, tabContent]);
  });

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block with the new block
  tabsBlock.replaceWith(block);
}
