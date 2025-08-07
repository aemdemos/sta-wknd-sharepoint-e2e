/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block within the given element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get all the tab labels (li.cmp-tabs__tab)
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('li'));

  // Get all tabpanel containers (must maintain source order)
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));
  // Defensive: Only keep as many panels as we have labels (should always match)
  const count = Math.min(tabLabels.length, tabPanels.length);

  // Build the table header row (block name exactly as required)
  const cells = [
    ['Tabs (tabs20)']
  ];

  // Add a row for each tab: [tab label, tab content]
  for (let i = 0; i < count; i++) {
    // Use the source LI for the label (strong semantic for tab label)
    const label = document.createElement('span');
    label.textContent = tabLabels[i].textContent.trim();
    // Use strong to match visual tab indicator in many tab patterns
    const strong = document.createElement('strong');
    strong.appendChild(label);

    // For the tab content: find the main article/contentfragment or fallback to panel children
    let contentElem = null;
    const article = tabPanels[i].querySelector('article');
    if (article) {
      // Reference the article element (do not clone)
      contentElem = article;
    } else {
      // If no article, create a fragment with all child nodes (excluding empty text nodes)
      const frag = document.createDocumentFragment();
      Array.from(tabPanels[i].childNodes).forEach(node => {
        if (node.nodeType === Node.TEXT_NODE && !node.textContent.trim()) return;
        frag.appendChild(node);
      });
      contentElem = frag;
    }
    cells.push([strong, contentElem]);
  }

  // Create the tab block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the .cmp-tabs element with the block table
  tabsBlock.replaceWith(block);
}
