/* global WebImporter */
export default function parse(element, { document }) {
  // Find the Tabs block container
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Find tab navigation (tab titles)
  const tabNav = tabsBlock.querySelector('.cmp-tabs__tablist');
  if (!tabNav) return;
  const tabTitles = Array.from(tabNav.querySelectorAll('.cmp-tabs__tab'));

  // Find tab panels (tab content)
  const tabPanels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tabpanel'));

  // Defensive: If number of panels doesn't match titles, bail
  if (tabTitles.length !== tabPanels.length) return;

  // Table header row
  const headerRow = ['Tabs (tabs7)'];
  const rows = [headerRow];

  // For each tab, extract label and content
  tabTitles.forEach((tabTitle, i) => {
    // Tab label (text)
    const label = tabTitle.textContent.trim();

    // Tab content panel
    const panel = tabPanels[i];
    if (!panel) return;

    // Find the main content inside the panel
    // If the panel contains a contentfragment/article, use that
    let content;
    const contentFragment = panel.querySelector('article.cmp-contentfragment');
    if (contentFragment) {
      content = contentFragment;
    } else {
      // Otherwise, use all children except empty grid wrappers
      const validNodes = Array.from(panel.childNodes).filter((node) => {
        if (node.nodeType === 1) {
          // Element node: skip empty grid wrappers
          if (
            node.classList &&
            (node.classList.contains('aem-Grid') || node.classList.contains('aem-GridColumn')) &&
            !node.textContent.trim()
          ) {
            return false;
          }
          return node.textContent.trim();
        }
        if (node.nodeType === 3) {
          // Text node
          return node.textContent.trim();
        }
        return false;
      });
      if (validNodes.length === 1) {
        content = validNodes[0];
      } else if (validNodes.length > 1) {
        // Wrap multiple nodes in a div
        const wrapper = document.createElement('div');
        validNodes.forEach((n) => wrapper.appendChild(n));
        content = wrapper;
      } else {
        content = document.createTextNode('');
      }
    }

    rows.push([label, content]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
