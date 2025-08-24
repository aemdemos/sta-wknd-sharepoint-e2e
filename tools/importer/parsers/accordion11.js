/* global WebImporter */
export default function parse(element, { document }) {
  // The goal is to create a 2-column accordion block from the main article content sections.
  // Each row: [Section Title, Section Content], header row: ['Accordion (accordion11)']

  // 1. Find the main content area. Prefer .contentfragment or .cmp-contentfragment
  let contentRoot = element.querySelector('article.contentfragment, .cmp-contentfragment');
  if (!contentRoot) {
    contentRoot = element;
  }

  // The structure is:
  // - direct children are mostly: .title (for article title/author), article.contentfragment (the rich content), etc.
  // Inside .contentfragment, children are:
  //    .cmp-contentfragment__title (title, H3)
  //    .cmp-contentfragment__elements
  //        - <div> (wrapper)
  //        - <div> (contains paragraphs, inner grids, etc)
  //            - <p> or <div> which contains further grids
  //            - <div class="aem-Grid ..."> (contains .title, .image, .text, etc)

  // We want to extract content into an array of accordion items: [titleEl, contentEls]
  // Each accordion section is visually/structurally marked by a H2 .cmp-title__text
  // Collect all H2s inside the content and the content that follows them up to the next H2
  const rows = [['Accordion (accordion11)']];
  // Find the elements container
  const elementsRoot = contentRoot.querySelector('.cmp-contentfragment__elements') || contentRoot;
  // Flatten all elements under elementsRoot for reliable traversal
  const allDesc = Array.from(elementsRoot.querySelectorAll(':scope > div, :scope > p, :scope > *'));
  // We'll create a flat list of nodes in order, including any elements inside sub-divs (for complex layouts)
  let flatNodes = [];
  allDesc.forEach((node) => {
    if (node.tagName === 'DIV') {
      // Sometimes div contains aem-Grid with more content
      if (node.classList.contains('aem-Grid')) {
        // Add each grid child
        flatNodes.push(...Array.from(node.children));
      } else {
        // Might be structural, but let's descend one level (for e.g. <div><p>..</p></div> cases)
        flatNodes.push(...Array.from(node.children));
      }
    } else {
      flatNodes.push(node);
    }
  });
  // Remove duplicates, keep order
  flatNodes = flatNodes.filter((v, i, a) => a.indexOf(v) === i);

  // Now, walk through nodes looking for each h2.cmp-title__text
  let i = 0;
  while (i < flatNodes.length) {
    let node = flatNodes[i];
    let h2 = null;
    if (node.tagName === 'DIV' && node.classList.contains('title')) {
      h2 = node.querySelector('h2.cmp-title__text');
    }
    if (h2) {
      // Found a section title
      const titleEl = h2;
      // Section content = everything after this .title (or h2), up to next .title/h2.cmp-title__text
      let contentEls = [];
      let j = i + 1;
      while (j < flatNodes.length) {
        let next = flatNodes[j];
        let nextH2 = (next.tagName === 'DIV' && next.classList.contains('title')) ? next.querySelector('h2.cmp-title__text') : null;
        if (nextH2) break;
        contentEls.push(next);
        j++;
      }
      // Remove empty nodes from contentEls
      contentEls = contentEls.filter(el => {
        // Remove if node is empty (besides whitespace), or only contains another .title
        if (!el.textContent.trim() && !el.querySelector('img, picture, video, iframe')) return false;
        return true;
      });
      if (contentEls.length === 1) {
        rows.push([titleEl, contentEls[0]]);
      } else {
        rows.push([titleEl, contentEls]);
      }
      i = j;
    } else {
      i++;
    }
  }

  // Only create table if we have at least one accordion row
  if (rows.length > 1) {
    const table = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(table);
  }
}
