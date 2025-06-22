/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block container
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels (li elements with .cmp-tabs__tab)
  const tabLabels = Array.from(
    tabsBlock.querySelectorAll('.cmp-tabs__tablist .cmp-tabs__tab')
  ).map(li => li.textContent.trim());

  // Get tab panels in order (divs with .cmp-tabs__tabpanel)
  const tabPanels = Array.from(
    tabsBlock.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Sanity check: number of tabs and panels should match
  if (tabLabels.length !== tabPanels.length) return;

  // Build table rows
  const rows = [
    ['Tabs (tabs24)']
  ];

  // Each row corresponds to a tab: [Tab Label, Tab Content]
  for (let i = 0; i < tabLabels.length; i++) {
    const tabLabel = tabLabels[i];
    const tabPanel = tabPanels[i];

    // Find the visible content for this tab
    // Usually there's a .contentfragment, and its .cmp-contentfragment__elements holds the content
    let tabContent = null;
    const contentFragment = tabPanel.querySelector('.contentfragment');
    if (contentFragment) {
      // We want to reference ALL the meaningful children of .cmp-contentfragment__elements
      // Sometimes the content is nested under .cmp-contentfragment__elements
      const elementsHolder = contentFragment.querySelector('.cmp-contentfragment__elements');
      if (elementsHolder) {
        // Gather only non-empty direct children (exclude empty grid wrappers)
        const meaningful = Array.from(elementsHolder.children).filter(child => {
          // Exclude empty .aem-Grid wrappers
          if (child.classList.contains('aem-Grid')) return false;
          // Exclude empty divs
          if (child.tagName === 'DIV' && child.textContent.trim() === '') return false;
          return true;
        });
        if (meaningful.length === 1) {
          tabContent = meaningful[0];
        } else if (meaningful.length > 1) {
          // If there's more than one, group them in a fragment
          const frag = document.createDocumentFragment();
          meaningful.forEach(node => frag.appendChild(node));
          tabContent = frag;
        } else {
          // fallback: reference the entire contentfragment
          tabContent = contentFragment;
        }
      } else {
        // fallback: reference the entire contentfragment
        tabContent = contentFragment;
      }
    } else {
      // fallback: reference the panel's content
      tabContent = tabPanel;
    }
    rows.push([tabLabel, tabContent]);
  }

  // Create block table with helper
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the tabs block in the DOM
  tabsBlock.replaceWith(block);
}
