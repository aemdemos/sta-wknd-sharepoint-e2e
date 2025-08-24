/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs block inside the element
  const tabsContainer = element.querySelector('.cmp-tabs');
  if (!tabsContainer) return;

  const tabList = tabsContainer.querySelector('.cmp-tabs__tablist');
  const tabLabels = [];
  if (tabList) {
    tabList.querySelectorAll('.cmp-tabs__tab').forEach(tab => {
      tabLabels.push(tab.textContent.trim());
    });
  }

  // Each panel is a [data-cmp-hook-tabs='tabpanel']
  const tabPanels = Array.from(tabsContainer.querySelectorAll("[data-cmp-hook-tabs='tabpanel']"));
  const cells = [];
  // Add the header row exactly as in the requirement
  cells.push(['Tabs (tabs28)']);

  // Structure: each row is [Tab Label, Tab Content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    let panelContent = tabPanels[i];
    let tabContent = null;
    if (panelContent) {
      // Try to get the main content of the tabpanel
      // Use the .cmp-contentfragment__elements if present, but remove empty grid wrappers
      const contentFragment = panelContent.querySelector('.cmp-contentfragment__elements');
      if (contentFragment) {
        // We'll create a container and move all meaningful children into it (skip aem-Grid spacers)
        const container = document.createElement('div');
        Array.from(contentFragment.children).forEach(child => {
          // skip pure grid spacers
          if (
            child.classList.contains('aem-Grid') ||
            (child.tagName === 'DIV' && child.children.length === 1 && child.firstElementChild && child.firstElementChild.classList.contains('aem-Grid'))
          ) {
            return;
          }
          container.appendChild(child);
        });
        // If container is not empty, use it, else fallback to full panelContent
        tabContent = container.childNodes.length ? container : panelContent;
      } else {
        tabContent = panelContent;
      }
    } else {
      tabContent = '';
    }
    cells.push([label, tabContent]);
  }

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
