/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block in the source HTML
  const tabsBlock = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  if (!tabsBlock) return;

  // Find tab headers (tab labels)
  const tabHeaderList = tabsBlock.querySelector('.cmp-tabs__tablist');
  if (!tabHeaderList) return;
  const tabHeaders = Array.from(tabHeaderList.querySelectorAll('.cmp-tabs__tab'));

  // Find tab panels (tab content)
  const tabPanels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tabpanel'));

  // Defensive: Only proceed if headers and panels match
  if (tabHeaders.length !== tabPanels.length || tabHeaders.length === 0) return;

  // Table header row
  const headerRow = ['Tabs (tabs37)'];
  const rows = [headerRow];

  // For each tab, extract label and content
  tabHeaders.forEach((tabHeader, i) => {
    // Tab label (text)
    const label = tabHeader.textContent.trim();

    // Tab content panel
    const panel = tabPanels[i];
    if (!panel) return;

    // For tab content, grab the direct contentfragment/article inside the panel
    let tabContent = null;
    const contentFragment = panel.querySelector('article.cmp-contentfragment');
    if (contentFragment) {
      tabContent = contentFragment.cloneNode(true);
    } else {
      tabContent = document.createElement('div');
      Array.from(panel.childNodes).forEach((node) => {
        tabContent.appendChild(node.cloneNode(true));
      });
    }

    // If there is a model in the contentfragment, add a comment at the top of the cell
    if (tabContent && tabContent.getAttribute && tabContent.getAttribute('data-cmp-contentfragment-model')) {
      const model = tabContent.getAttribute('data-cmp-contentfragment-model');
      const comment = document.createComment(` model: ${model} `);
      tabContent.insertBefore(comment, tabContent.firstChild);
    }

    rows.push([label, tabContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block with the new table
  tabsBlock.replaceWith(block);
}
