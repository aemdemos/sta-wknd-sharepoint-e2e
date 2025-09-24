/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.tabs.panelcontainer');
  if (!tabsBlock) return;

  // Find the tabs component inside the block
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get all tab labels
  const tabLabels = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab')
  );

  // Get all tab panels
  const tabPanels = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Defensive: number of labels and panels should match
  if (tabLabels.length !== tabPanels.length) return;

  // Table header
  const headerRow = ['Tabs (tabs35)'];
  const rows = [headerRow];

  // For each tab, get label and content
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];

    // Tab content: grab all direct children of the tabpanel
    // Defensive: sometimes contentfragment/article is nested
    let tabContent = null;
    // Find the main contentfragment/article inside the panel
    const contentFragment = panel.querySelector('article.cmp-contentfragment');
    if (contentFragment) {
      // Use the contentfragment's children except the title
      // Remove the h3 title if present
      const fragmentChildren = Array.from(contentFragment.children).filter(
        (child) => !(child.tagName === 'H3' && child.classList.contains('cmp-contentfragment__title'))
      );
      // If there's only one child, use it directly
      if (fragmentChildren.length === 1) {
        tabContent = fragmentChildren[0];
      } else {
        // Otherwise, wrap in a div
        tabContent = document.createElement('div');
        fragmentChildren.forEach((child) => tabContent.appendChild(child));
      }
    } else {
      // Fallback: use all children
      tabContent = document.createElement('div');
      Array.from(panel.children).forEach((child) => tabContent.appendChild(child));
    }

    rows.push([label, tabContent]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabs block with the new table
  tabsBlock.replaceWith(block);
}
