/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block inside the element
  const tabsBlock = element.querySelector('.tabs .cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels (li elements)
  const tabLabels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tablist > li'));

  // Get tab content panels, in order
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Begin table array with header row exactly as specified
  const headerRow = ['Tabs (tabs18)'];
  const tableRows = [headerRow];

  // Iterate tabs and build row for each
  tabLabels.forEach((tabLabel, idx) => {
    const label = tabLabel.textContent.trim();
    // Get corresponding tabpanel
    const tabPanel = tabPanels[idx];
    if (!tabPanel) return;
    // Find inner contentfragment/article (if exists)
    const contentFragment = tabPanel.querySelector('article.cmp-contentfragment');

    let tabContent;
    if (contentFragment) {
      // Remove the title from contentfragment (if exists)
      const children = Array.from(contentFragment.children).filter(child => {
        return !child.classList || !child.classList.contains('cmp-contentfragment__title');
      });
      // If no child, fallback to all childNodes
      tabContent = children.length ? children : Array.from(contentFragment.childNodes);
    } else {
      // fallback to all tabPanel childNodes
      tabContent = Array.from(tabPanel.childNodes);
    }
    // If only one element, use it directly; otherwise, pass an array
    if (Array.isArray(tabContent) && tabContent.length === 1) {
      tabContent = tabContent[0];
    }
    tableRows.push([label, tabContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the old tabs block with the new block table
  tabsBlock.parentNode.replaceChild(block, tabsBlock);
}