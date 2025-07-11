/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs element (the main tabs block)
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels from the ordered list
  const tabLabelEls = tabsBlock.querySelectorAll('.cmp-tabs__tablist > li');
  const tabLabels = Array.from(tabLabelEls).map((li) => li.textContent.trim());

  // Get tab contents from the tabpanel elements, in order
  const tabPanels = Array.from(
    tabsBlock.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Table header: block name as in requirements
  const rows = [['Tabs (tabs14)']];

  // For each tab, extract the label and content
  for (let i = 0; i < tabLabels.length && i < tabPanels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    // Find the key content in the tab panel, referencing existing elements
    let content = null;
    // Prefer the main article/contentfragment, else fall back to all children
    const article = panel.querySelector('article.cmp-contentfragment');
    if (article) {
      content = article;
    } else {
      // fallback: look for a main contentfragment div
      const cfDiv = panel.querySelector('.contentfragment');
      if (cfDiv) {
        content = cfDiv;
      } else {
        // fallback: use all child nodes as an array (to preserve all content)
        content = Array.from(panel.childNodes).filter(
          node => !(node.nodeType === Node.TEXT_NODE && !node.textContent.trim())
        );
        // If still empty, fallback to panel
        if (content.length === 0) {
          content = panel;
        }
      }
    }
    rows.push([label, content]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original tabs block with the new table
  tabsBlock.replaceWith(block);
}
