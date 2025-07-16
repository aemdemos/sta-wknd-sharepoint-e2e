/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block in the element
  const tabsBlock = element.querySelector('.tabs .cmp-tabs');
  if (!tabsBlock) return;

  // Get all tabs (labels)
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  const tabLabels = tabList ? Array.from(tabList.querySelectorAll('li')) : [];

  // Get all tab panels in order
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[role="tabpanel"]'));

  // Header row: block name must match exactly
  const headerRow = ['Tabs (tabs19)'];

  // Compose rows for each tab: [Tab Label, Tab Content]
  const rows = tabLabels.map((tabLabel, i) => {
    const label = tabLabel ? tabLabel.textContent.trim() : '';
    const tabPanel = tabPanels[i];
    let content = '';
    if (tabPanel) {
      // Find main content inside tabPanel
      // Prefer the .cmp-contentfragment__elements div if available
      const contentFragment = tabPanel.querySelector('article.cmp-contentfragment');
      let toInclude = null;
      if (contentFragment) {
        const cfElements = contentFragment.querySelector('.cmp-contentfragment__elements');
        if (cfElements) {
          // Remove empty .aem-Grid divs for cleanliness
          Array.from(cfElements.querySelectorAll('.aem-Grid')).forEach(gr => {
            if (gr.textContent.trim() === '') gr.remove();
          });
          toInclude = cfElements;
        }
      }
      // If we have a .cmp-contentfragment__elements, use that, else fallback to tabPanel's children
      if (toInclude) {
        content = toInclude;
      } else {
        // Fallback: include all children of tabPanel
        // (exclude script/style/meta)
        const fragment = document.createElement('div');
        Array.from(tabPanel.childNodes).forEach(node => {
          if (!(node.nodeType === Node.ELEMENT_NODE && ['SCRIPT','STYLE','META'].includes(node.tagName))) {
            fragment.appendChild(node);
          }
        });
        content = fragment.childNodes.length === 1 ? fragment.firstChild : fragment;
      }
    }
    return [label, content];
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);

  // Replace the tabs block with the new table
  tabsBlock.replaceWith(table);
}
