/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs container inside the provided element
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get tab labels in order
  const tablist = tabsRoot.querySelector('.cmp-tabs__tablist');
  if (!tablist) return;
  const tabLabelEls = Array.from(tablist.querySelectorAll('li'));
  const tabLabels = tabLabelEls.map(li => li.textContent.trim());

  // Get all tab panels (in order)
  const tabPanelEls = Array.from(tabsRoot.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Helper: filter out grid/utility divs from tab content
  function extractTabContent(panel) {
    const content = [];
    Array.from(panel.children).forEach(child => {
      if (
        child.classList && (
          child.classList.contains('aem-Grid') ||
          child.classList.contains('aem-Grid--12') ||
          child.classList.contains('aem-Grid--default--12')
        )
      ) return;
      if (
        child.tagName &&
        child.tagName.toLowerCase() !== 'script' &&
        child.tagName.toLowerCase() !== 'style'
      ) {
        if (child.querySelector && child.querySelector('article.cmp-contentfragment')) {
          content.push(child.querySelector('article.cmp-contentfragment'));
        } else if (child.textContent.trim() || child.querySelector('img,ul,ol')) {
          content.push(child);
        }
      }
    });
    // If only one content block, just return it
    return content.length === 1 ? content[0] : content;
  }

  // Structure: [[header], [tab labels...], [tab content...]]
  const rows = [];
  rows.push(["Tabs (tabs18)"]);
  rows.push(tabLabels);
  const contentRow = tabPanelEls.map(panel => extractTabContent(panel));
  rows.push(contentRow);

  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
