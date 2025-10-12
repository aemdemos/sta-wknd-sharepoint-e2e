/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs container
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get tab labels (they are <li> inside .cmp-tabs__tablist)
  const tabLabels = Array.from(
    tabs.querySelectorAll('.cmp-tabs__tablist > li')
  ).map(li => li.textContent.trim());

  // Get tab panels (they are <div> with role="tabpanel")
  const tabPanels = Array.from(
    tabs.querySelectorAll('[role="tabpanel"]')
  );

  // Defensive: ensure labels and panels match
  if (tabLabels.length !== tabPanels.length) return;

  // --- Extract sidebar content (Activity, Adventure Type, Trip Length, Group Size, Difficulty, Price, Share this Adventure, sharing buttons) ---
  let sidebarContent = document.createDocumentFragment();
  const sidebarFragment = document.createDocumentFragment();
  // Find the sidebar summary (dl.cmp-contentfragment__elements)
  const sidebarDL = element.querySelector('dl.cmp-contentfragment__elements');
  if (sidebarDL) {
    sidebarFragment.appendChild(sidebarDL.cloneNode(true));
  }
  // Find the Share this Adventure title
  const shareTitle = element.querySelector('.title .cmp-title__text, .cmp-title__text');
  if (shareTitle && /share/i.test(shareTitle.textContent)) {
    const shareDiv = document.createElement('div');
    shareDiv.textContent = shareTitle.textContent.trim();
    sidebarFragment.appendChild(shareDiv);
  }
  // Find the sharing buttons
  const sharingDiv = element.querySelector('.sharing');
  if (sharingDiv) {
    sidebarFragment.appendChild(sharingDiv.cloneNode(true));
  }
  sidebarContent = sidebarFragment;

  // Build the table rows
  const rows = [];
  // Header row as specified
  rows.push(['Tabs (tabs16)']);

  // Insert the sidebar as its own row (single cell, before the tabs)
  if (sidebarContent.childNodes.length) {
    rows.push([sidebarContent]);
  }

  // Each tab: label in col 1, content in col 2
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];

    // For content: extract all direct children of the tabpanel (to preserve structure)
    const frag = document.createDocumentFragment();
    Array.from(panel.childNodes).forEach(node => {
      if (node.nodeType === Node.TEXT_NODE && !node.textContent.trim()) return;
      if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'DIV' && !node.textContent.trim()) return;
      frag.appendChild(node.cloneNode(true));
    });

    rows.push([label, frag]);
  }

  // Create the table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(table);
}
