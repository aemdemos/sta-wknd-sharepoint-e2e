/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.tabs.panelcontainer');
  if (!tabsBlock) return;

  // Find the actual tabs component
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels from the tablist
  const tabLabels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get tab panels (content)
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Defensive: ensure labels and panels match
  if (tabLabels.length !== tabPanels.length || tabLabels.length === 0) return;

  // Table header row: must match block name exactly
  const headerRow = ['Tabs (tabs23)'];
  const rows = [headerRow];

  // For each tab, add a row: [Tab Label, Tab Content]
  tabLabels.forEach((tabLabel, i) => {
    // Tab label text
    const label = tabLabel.textContent.trim();
    // Tab content: use the actual tab panel element (reference, not clone)
    const panel = tabPanels[i];
    // Use a <div> to wrap the label for semantic clarity (no markdown)
    const labelEl = document.createElement('div');
    labelEl.textContent = label;
    // Use the panel's children as content, or the panel itself if no children
    let contentEl;
    if (panel.children.length === 1) {
      contentEl = panel.children[0];
    } else if (panel.children.length > 1) {
      // Wrap multiple children in a fragment
      contentEl = document.createDocumentFragment();
      Array.from(panel.childNodes).forEach(child => contentEl.appendChild(child));
    } else {
      contentEl = panel;
    }
    rows.push([labelEl, contentEl]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabs block with the block table
  tabsBlock.replaceWith(block);
}
