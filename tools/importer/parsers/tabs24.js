/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the correct '.tabs' block root
  const tabsSection = element.querySelector('.tabs');
  if (!tabsSection) return;

  // Get the cmp-tabs container inside
  const cmpTabs = tabsSection.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Collect all tab headers in order
  const tabHeaders = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tablist [role="tab"]'));
  // Collect all tabpanels (tab contents) in DOM order
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[role="tabpanel"]'));

  // Compose the header row exactly as required
  const headerRow = ['Tabs (tabs24)'];

  // Build content rows: [label, tabContent]
  const rows = tabHeaders.map((tabHeader, idx) => {
    // Label
    const label = tabHeader.textContent.trim();
    // Panel content: reference the direct tabpanel node
    const panel = tabPanels[idx];
    if (!panel) return null;
    // We want to reference the real DOM node, not a clone; but need to strip the h3 heading if present
    // We'll create a DocumentFragment to hold the content, referencing original children only
    const frag = document.createDocumentFragment();
    // Find the cmp-contentfragment as the main tab content
    const contentFragment = panel.querySelector('.cmp-contentfragment');
    let contentRoot = contentFragment || panel;
    // Remove the first h3 inside cmp-contentfragment if present
    if (contentFragment) {
      const children = Array.from(contentFragment.children);
      children.forEach(child => {
        if (!(child.tagName === 'H3' && child.classList.contains('cmp-contentfragment__title'))) {
          frag.appendChild(child);
        }
      });
    } else {
      // If no contentfragment, just append all children of the panel
      Array.from(panel.childNodes).forEach(child => {
        frag.appendChild(child);
      });
    }
    return [label, frag];
  }).filter(Boolean);

  // Compose table cells
  const cells = [headerRow, ...rows];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the entire tabs block section with the new table
  tabsSection.replaceWith(table);
}
