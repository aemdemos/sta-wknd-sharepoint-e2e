/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block within the element
  let tabsContainer = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  let tabsBlock = tabsContainer;
  if (tabsContainer && !tabsContainer.classList.contains('cmp-tabs')) {
    tabsBlock = tabsContainer.querySelector('.cmp-tabs');
  }
  if (!tabsBlock) return;

  // Get tab labels (li[role="tab"])
  const tablist = tabsBlock.querySelector('.cmp-tabs__tablist');
  const tabLabels = [];
  if (tablist) {
    tablist.querySelectorAll('li[role="tab"]').forEach(tab => {
      tabLabels.push(tab.textContent.trim());
    });
  }

  // Get tab panels and corresponding content
  // Each tabpanel contains .contentfragment, whose content we preserve (reference existing elements)
  const panels = tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]');
  const tabContents = [];
  panels.forEach(panel => {
    // Look for <article class="cmp-contentfragment"> or <div class="contentfragment">
    let contentEl = panel.querySelector('article.cmp-contentfragment, div.contentfragment');
    if (contentEl) {
      tabContents.push(contentEl);
    } else {
      // If no content fragment, use the direct panel
      tabContents.push(panel);
    }
  });

  // Defensive: If there are less panels than labels, fill with empty divs
  while (tabContents.length < tabLabels.length) {
    tabContents.push(document.createElement('div'));
  }

  // Compose the table
  const headerRow = ['Tabs (tabs36)'];
  const cells = [headerRow];
  for (let i = 0; i < tabLabels.length; i++) {
    cells.push([tabLabels[i], tabContents[i]]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the tabs block container in the DOM with the table
  tabsContainer.parentNode.replaceChild(block, tabsContainer);
}
