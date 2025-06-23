/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs container
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Find the tab list (should be <ol> or <ul> with class 'cmp-tabs__tablist')
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;

  // Get tab items (labels)
  const tabItems = Array.from(tabList.children).filter((li) => li.getAttribute('role') === 'tab');
  const tabNames = tabItems.map((li) => li.textContent.trim());

  // Find all tab panels (in tab order)
  const tabPanels = Array.from(tabs.querySelectorAll('[role="tabpanel"]'));

  // Build the rows array for the table
  const rows = [];
  // First row is the single-cell header
  rows.push(['Tabs (tabs18)']);

  // Each subsequent row is a [tab label, tab content]
  for (let i = 0; i < tabNames.length; i++) {
    const tabName = tabNames[i];
    const panel = tabPanels[i];
    if (!tabName || !panel) continue;

    // Prefer the <article> inside panel if available, else all meaningful children
    let content = null;
    const article = panel.querySelector('article');
    if (article) {
      content = article;
    } else {
      // Fallback to all non-empty children
      let meaningfulChildren = Array.from(panel.children).filter(child => {
        if (child.tagName === 'DIV' && child.classList.contains('aem-Grid')) return false;
        if (child.tagName === 'DIV' && child.children.length === 0 && child.textContent.trim() === '') return false;
        return true;
      });
      if (meaningfulChildren.length === 1) {
        content = meaningfulChildren[0];
      } else if (meaningfulChildren.length > 1) {
        content = meaningfulChildren;
      } else {
        // fallback: all children or the panel itself if nothing else
        content = Array.from(panel.childNodes).filter(node => {
          return (node.nodeType === 1) || (node.nodeType === 3 && node.textContent.trim() !== '');
        });
        if (content.length === 1) {
          content = content[0];
        }
      }
      if (!content) {
        content = panel;
      }
    }
    rows.push([tabName, content]);
  }

  // Build the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabs element with the new block table
  tabs.parentNode.replaceChild(block, tabs);
}
