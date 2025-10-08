/* global WebImporter */
export default function parse(element, { document }) {
  // Tabs (tabs12) block parsing for article sections
  const headerRow = ['Tabs (tabs12)'];
  const tabRows = [];

  // Locate the main contentfragment/article
  const contentFragment = element.querySelector('.contentfragment, article.cmp-contentfragment');
  if (!contentFragment) return;

  // Gather all child nodes of contentFragment
  const children = Array.from(contentFragment.children);

  // Find all indices of h2 section wrappers
  const sectionIndices = [];
  children.forEach((child, idx) => {
    const h2 = child.querySelector && child.querySelector('h2.cmp-title__text, h2');
    if (h2) sectionIndices.push(idx);
  });

  // Compose the intro tab: everything before the first h2 section
  if (sectionIndices.length > 0 && sectionIndices[0] > 0) {
    const introFragment = document.createDocumentFragment();
    for (let i = 0; i < sectionIndices[0]; i++) {
      introFragment.appendChild(children[i].cloneNode(true));
    }
    tabRows.push(['Introduction', introFragment]);
  }

  // For each h2 section, collect its content until the next h2
  for (let i = 0; i < sectionIndices.length; i++) {
    const startIdx = sectionIndices[i];
    const endIdx = (i + 1 < sectionIndices.length) ? sectionIndices[i + 1] : children.length;
    // Get the section label
    const h2 = children[startIdx].querySelector && children[startIdx].querySelector('h2.cmp-title__text, h2');
    const label = h2 ? h2.textContent.trim() : `Section ${i + 1}`;
    // Compose the section fragment
    const sectionFragment = document.createDocumentFragment();
    for (let j = startIdx; j < endIdx; j++) {
      sectionFragment.appendChild(children[j].cloneNode(true));
    }
    tabRows.push([label, sectionFragment]);
  }

  // Compose the block table
  const cells = [headerRow, ...tabRows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
