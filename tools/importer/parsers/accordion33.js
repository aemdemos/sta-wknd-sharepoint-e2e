/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main contentfragment article
  const contentFragment = element.querySelector('.contentfragment article.cmp-contentfragment');
  if (!contentFragment) return;

  // Always use this header row
  const headerRow = ['Accordion (accordion33)'];
  const rows = [headerRow];

  // Get the elements container
  const elementsContainer = contentFragment.querySelector('.cmp-contentfragment__elements');
  if (!elementsContainer) return;
  const children = Array.from(elementsContainer.children);

  // Flatten content, including images inside .aem-Grid
  let flatContent = [];
  children.forEach(child => {
    if (child.classList && child.classList.contains('aem-Grid')) {
      child.querySelectorAll('.cmp-image').forEach(img => flatContent.push(img));
    } else {
      flatContent.push(child);
    }
  });

  // Build accordion items: each item is a title (h2 or 'Introduction') and all content up to next h2
  let idx = 0;
  // Gather intro content before first h2
  let introContent = [];
  while (idx < flatContent.length && flatContent[idx].tagName !== 'H2') {
    introContent.push(flatContent[idx]);
    idx++;
  }
  if (introContent.length) {
    const introTitle = document.createElement('span');
    introTitle.textContent = 'Introduction';
    const introCell = document.createElement('div');
    introContent.forEach(node => introCell.appendChild(node.cloneNode(true)));
    rows.push([introTitle, introCell]);
  }

  // For each h2 section, gather all content until next h2 as a single accordion item
  while (idx < flatContent.length) {
    if (flatContent[idx].tagName === 'H2') {
      const title = flatContent[idx].cloneNode(true);
      idx++;
      const sectionContent = [];
      while (idx < flatContent.length && flatContent[idx].tagName !== 'H2') {
        sectionContent.push(flatContent[idx]);
        idx++;
      }
      if (sectionContent.length) {
        const contentCell = document.createElement('div');
        sectionContent.forEach(node => contentCell.appendChild(node.cloneNode(true)));
        rows.push([title, contentCell]);
      }
    } else {
      idx++;
    }
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
