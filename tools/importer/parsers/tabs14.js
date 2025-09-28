/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.tabs .cmp-tabs');
  if (!tabsBlock) return;

  // Extract tab labels
  const tabLabels = Array.from(
    tabsBlock.querySelectorAll('.cmp-tabs__tablist > li')
  ).map(li => li.textContent.trim());

  // Extract tab panels (content)
  const tabPanels = Array.from(
    tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]')
  );

  if (!tabLabels.length || !tabPanels.length) return;

  // Block header row
  const headerRow = ['Tabs (tabs14)'];
  const rows = [headerRow];

  // For each tab, add a row: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    if (!panel) continue;

    // Get the main contentfragment/article inside panel
    const contentFragment = panel.querySelector('article.cmp-contentfragment');
    let tabContent;
    if (contentFragment) {
      // Use the .cmp-contentfragment__elements if present
      const elements = contentFragment.querySelector('.cmp-contentfragment__elements');
      if (elements) {
        // Use all children of .cmp-contentfragment__elements (preserving structure)
        const frag = document.createElement('div');
        Array.from(elements.childNodes).forEach(node => {
          frag.appendChild(node.cloneNode(true));
        });
        tabContent = frag;
      } else {
        tabContent = contentFragment;
      }
    } else {
      // Fallback: use the panel itself
      tabContent = panel;
    }
    rows.push([label, tabContent]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabs block with the new block table
  tabsBlock.replaceWith(block);
}
