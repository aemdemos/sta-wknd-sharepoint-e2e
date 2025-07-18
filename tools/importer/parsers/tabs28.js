/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Find tab labels, in order
  const tabList = tabsRoot.querySelector('.cmp-tabs__tablist');
  const tabLabels = [];
  if (tabList) {
    tabList.querySelectorAll('li[role="tab"]').forEach(tab => {
      tabLabels.push(tab.textContent.trim());
    });
  }

  // Find tab panels, in order (should match tabLabels by order)
  // NOTE: Some tabs might not have a panel, so must check for missing panels
  const tabPanels = Array.from(tabsRoot.querySelectorAll('.cmp-tabs__tabpanel'));

  // Compose the table rows
  const cells = [];
  // Table header row - must match example exactly
  cells.push(['Tabs (tabs28)']);

  // For each tab
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    let content = null;
    if (panel) {
      // Prefer referencing the contentfragment/article inside, if present
      let mainContent = panel.querySelector('article, .contentfragment');
      if (mainContent) {
        content = mainContent;
      } else {
        // fallback to the actual panel (which may contain directly the relevant nodes)
        // Remove any empty wrappers like .aem-Grid or empty divs
        // We'll create a DocumentFragment to hold only non-empty children
        const frag = document.createDocumentFragment();
        Array.from(panel.childNodes).forEach(child => {
          // Filter out empty wrapper divs
          if (child.nodeType === 1 && child.matches('div.aem-Grid, div:empty')) return;
          frag.appendChild(child.cloneNode(true));
        });
        // If there's at least one element, use the fragment, else fallback to the panel
        if (frag.childNodes.length) {
          content = frag;
        } else {
          content = panel;
        }
      }
    } else {
      content = document.createTextNode(''); // fallback: empty
    }
    cells.push([label, content]);
  }

  // Create the table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace only the .cmp-tabs element with the block table
  tabsRoot.replaceWith(block);
}
