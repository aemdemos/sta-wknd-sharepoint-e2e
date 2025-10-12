/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Find tab labels (li elements inside tablist)
  const tabLabels = Array.from(
    tabsRoot.querySelectorAll('.cmp-tabs__tablist > li[role="tab"]')
  );

  // Find tab panels (divs with role="tabpanel")
  const tabPanels = Array.from(
    tabsRoot.querySelectorAll('[role="tabpanel"]')
  );

  // Defensive: ensure we have matching labels and panels
  if (!tabLabels.length || !tabPanels.length || tabLabels.length !== tabPanels.length) return;

  // Table header row
  const headerRow = ['Tabs (tabs31)'];
  const rows = [headerRow];

  // For each tab, extract label and content
  tabLabels.forEach((tabLabel, i) => {
    // Tab label text
    const label = tabLabel.textContent.trim();

    // Tab content panel
    const panel = tabPanels[i];
    if (!panel) return;

    // Find the main content fragment/article inside the panel
    let contentRoot = panel.querySelector('article') || panel;
    // Compose a DocumentFragment for tab content
    const frag = document.createDocumentFragment();
    Array.from(contentRoot.children).forEach(child => {
      frag.appendChild(child.cloneNode(true));
    });
    if (!frag.childNodes.length) {
      frag.append(document.createTextNode(contentRoot.textContent.trim()));
    }
    rows.push([
      label,
      frag
    ]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
