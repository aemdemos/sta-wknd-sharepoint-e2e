/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header
  const headerRow = ['Accordion (accordion11)'];
  const rows = [headerRow];

  // Find the main content area (the article)
  let mainContent = element.querySelector('article.contentfragment');
  if (!mainContent) {
    mainContent = element.querySelector('article');
  }
  if (!mainContent) return;

  // The content is inside .cmp-contentfragment__elements
  const contentRoot = mainContent.querySelector('.cmp-contentfragment__elements');
  if (!contentRoot) return;

  // Get all direct children of contentRoot
  const children = Array.from(contentRoot.children);

  // Helper: Find all h2 section indexes
  const h2Indexes = [];
  children.forEach((child, i) => {
    if (
      child &&
      child.querySelector &&
      child.querySelector('.cmp-title__text') &&
      child.querySelector('.cmp-title__text').tagName === 'H2'
    ) {
      h2Indexes.push(i);
    }
  });

  // Step 1: Gather all intro paragraphs and blockquotes before first h2 section
  let introDiv = document.createElement('div');
  let introHasContent = false;
  for (let i = 0; i < (h2Indexes[0] !== undefined ? h2Indexes[0] : children.length); i++) {
    const child = children[i];
    if (child && child.querySelectorAll) {
      child.querySelectorAll('p,blockquote').forEach(el => {
        if (el.textContent.trim()) {
          introDiv.appendChild(el.cloneNode(true));
          introHasContent = true;
        }
      });
    }
    // Also include .cmp-text blocks if present
    if (child && child.querySelector && child.querySelector('.cmp-text')) {
      const cmpText = child.querySelector('.cmp-text');
      if (cmpText.textContent.trim()) {
        introDiv.appendChild(cmpText.cloneNode(true));
        introHasContent = true;
      }
    }
  }
  if (introHasContent) {
    rows.push(['Introduction', introDiv]);
  }

  // Step 2: For each h2 section, gather all content until the next h2 section
  for (let h = 0; h < h2Indexes.length; h++) {
    const idx = h2Indexes[h];
    const node = children[idx];
    const h2El = node && node.querySelector && node.querySelector('.cmp-title__text') && node.querySelector('.cmp-title__text').tagName === 'H2' ? node.querySelector('.cmp-title__text') : null;
    if (h2El) {
      const title = h2El.textContent.trim();
      // Gather all content until the next h2 section
      const contentEls = [];
      let nextIdx = h2Indexes[h + 1] !== undefined ? h2Indexes[h + 1] : children.length;
      for (let j = idx + 1; j < nextIdx; j++) {
        const sectionChild = children[j];
        if (sectionChild) {
          // Include everything (paragraphs, images, blockquotes, .cmp-text, etc)
          if (sectionChild.querySelectorAll) {
            sectionChild.querySelectorAll('p,blockquote,img,div,figure').forEach(el => {
              if (el.textContent.trim() || el.tagName === 'IMG' || el.tagName === 'FIGURE') {
                contentEls.push(el.cloneNode(true));
              }
            });
          }
          // If the node itself is a .cmp-text or image, include it
          if (sectionChild.classList && sectionChild.classList.contains('cmp-text')) {
            contentEls.push(sectionChild.cloneNode(true));
          }
          if (sectionChild.querySelector && sectionChild.querySelector('img')) {
            // If not already included
            const imgs = sectionChild.querySelectorAll('img');
            imgs.forEach(img => contentEls.push(img.cloneNode(true)));
          }
        }
      }
      // If only one element, use it directly; if multiple, wrap in a div
      let contentCell;
      if (contentEls.length === 1) {
        contentCell = contentEls[0];
      } else if (contentEls.length > 1) {
        const wrapper = document.createElement('div');
        contentEls.forEach(e => wrapper.appendChild(e));
        contentCell = wrapper;
      } else {
        // fallback: include the full section node if nothing else
        contentCell = node.cloneNode(true);
      }
      rows.push([title, contentCell]);
    }
  }

  // Create the accordion block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
