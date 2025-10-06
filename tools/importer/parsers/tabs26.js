/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.tabs .cmp-tabs');
  if (!tabsBlock) return;

  // Extract tab labels (order matters)
  const tabLabels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tablist > li'));
  // Extract tab panels (order matters)
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Defensive: Only proceed if labels and panels match
  if (tabLabels.length !== tabPanels.length || tabLabels.length === 0) return;

  // Table header row
  const headerRow = ['Tabs (tabs26)'];
  const rows = [headerRow];

  // For each tab, build [label, content] row
  tabLabels.forEach((labelEl, idx) => {
    // Tab label (text)
    const label = labelEl.textContent.trim();
    // Tab content (panel)
    const panel = tabPanels[idx];
    if (!panel) return;

    // Compose tab content
    // Reference the main contentfragment/article inside each panel
    let tabContent = null;
    const contentFragment = panel.querySelector('.cmp-contentfragment');
    if (contentFragment) {
      // Use the entire contentfragment as the tab content (reference, not clone)
      tabContent = contentFragment;
    } else {
      // Fallback: use all children of panel (reference, not clone)
      tabContent = Array.from(panel.childNodes);
    }

    rows.push([label, tabContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace original tabs block with new table
  tabsBlock.parentNode.replaceChild(block, tabsBlock);
}
