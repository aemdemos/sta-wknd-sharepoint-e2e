/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the tabs block container
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels (li[role="tab"])
  const tabList = tabsBlock.querySelector('[role="tablist"]');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('[role="tab"]'));

  // Get tab panels ([role="tabpanel"])
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[role="tabpanel"]'));
  if (tabLabels.length === 0 || tabPanels.length === 0) return;

  // Table header row as required
  const headerRow = ['Tabs (tabs21)'];
  const rows = [headerRow];

  // For each tab, extract label and content
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];
    if (!panel) continue;

    // Find the main content fragment/article inside the panel
    let tabContent = [];
    const contentFragment = panel.querySelector('.contentfragment, article.cmp-contentfragment');
    if (contentFragment) {
      // Exclude the contentfragment title (if present)
      Array.from(contentFragment.children).forEach(child => {
        if (!child.classList.contains('cmp-contentfragment__title')) {
          tabContent.push(child);
        }
      });
    } else {
      // Fallback: use all children of the panel
      tabContent = Array.from(panel.children);
    }

    // If nothing found, fallback to text
    if (tabContent.length === 0 && panel.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = panel.textContent.trim();
      tabContent.push(p);
    }

    // If only one element, use it directly
    rows.push([
      label,
      tabContent.length === 1 ? tabContent[0] : tabContent
    ]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  tabsBlock.replaceWith(block);
}
