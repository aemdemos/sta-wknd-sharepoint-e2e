/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block container
  const tabsBlock = element.querySelector('.tabs.panelcontainer');
  if (!tabsBlock) return;

  // Find the tabs navigation and all tab panels
  const tabs = tabsBlock.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get tab labels from the tablist
  const tabLabels = Array.from(tabs.querySelectorAll('.cmp-tabs__tab'));
  // Get tab panels (content)
  const tabPanels = Array.from(tabs.querySelectorAll('.cmp-tabs__tabpanel'));

  // Defensive: Only proceed if labels and panels match
  if (tabLabels.length !== tabPanels.length || tabLabels.length === 0) return;

  // Table header row
  const headerRow = ['Tabs (tabs36)'];
  const rows = [headerRow];

  // Each tab: [label, content]
  tabLabels.forEach((tabLabel, idx) => {
    // Tab label text
    const labelText = tabLabel.textContent.trim();
    // Tab panel content
    const panel = tabPanels[idx];
    // Defensive: If panel is missing, skip
    if (!panel) return;
    // For robustness, extract the direct content of the panel
    // Usually there's one main contentfragment/article inside each panel
    let tabContent;
    const contentFragment = panel.querySelector('article.cmp-contentfragment');
    if (contentFragment) {
      tabContent = contentFragment;
    } else {
      // Fallback: use all children of the panel
      tabContent = Array.from(panel.childNodes).filter(node => node.nodeType === 1);
      if (tabContent.length === 1) tabContent = tabContent[0];
    }
    rows.push([labelText, tabContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original tabs block element with the block table
  tabsBlock.replaceWith(block);
}
