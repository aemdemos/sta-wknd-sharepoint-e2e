/* global WebImporter */
export default function parse(element, { document }) {
  // Create header row
  const cells = [['Accordion (accordion32)']];
  // Our goal is to extract accordion items. For the provided HTML,
  // the best fit is the "Up Next" list in the sidebar, but if not present, try article sections.

  // 1. Try to extract from sidebar Up Next list
  const sidebar = element.querySelector('aside.container');
  let foundAccordion = false;
  if (sidebar) {
    const list = sidebar.querySelector('.cmp-list');
    if (list) {
      const items = Array.from(list.querySelectorAll('li.cmp-list__item'));
      for (const li of items) {
        // The clickable title
        const link = li.querySelector('a.cmp-list__item-link');
        if (link) {
          const titleEl = link.querySelector('.cmp-list__item-title');
          const titleText = titleEl ? titleEl.textContent.trim() : link.textContent.trim();
          // Use the full link (contains title and date)
          cells.push([titleText, link]);
          foundAccordion = true;
        }
      }
    }
  }

  // 2. If sidebar Up Next not present, try extracting from the article's section headings
  if (!foundAccordion) {
    // Find the main article contentfragment
    const article = element.querySelector('article.contentfragment');
    if (article) {
      // Find all h2.cmp-title__text for each section
      const h2s = Array.from(article.querySelectorAll('h2.cmp-title__text'));
      for (const h2 of h2s) {
        const titleText = h2.textContent.trim();
        // Gather all content until the next h2 (exclusive)
        const sectionContent = [];
        // Always start from the parent .cmp-title, then next siblings
        let node = h2.closest('.cmp-title').nextSibling;
        while (node) {
          // If next h2.cmp-title__text is detected, stop
          if (node.nodeType === 1 && node.matches('.cmp-title')) {
            const nextH2 = node.querySelector('h2.cmp-title__text');
            if (nextH2) break;
          }
          // If element node, include paragraphs, images, blockquotes
          if (node.nodeType === 1) {
            // If paragraphs exist, add them
            const ps = node.querySelectorAll ? node.querySelectorAll('p') : [];
            if (ps.length) {
              sectionContent.push(...ps);
            }
            // If images exist, add them
            const imgs = node.querySelectorAll ? node.querySelectorAll('img.cmp-image__image') : [];
            for (const img of imgs) {
              // Use the parent .cmp-image div so image and possible captions come together
              const cmpImage = img.closest('.cmp-image');
              sectionContent.push(cmpImage || img);
            }
            // If blockquotes exist, add them
            const bqs = node.querySelectorAll ? node.querySelectorAll('blockquote') : [];
            if (bqs.length) {
              sectionContent.push(...bqs);
            }
            // If node is itself a <p>, blockquote, or .cmp-image, and not included above
            if (node.tagName === 'P' && !sectionContent.includes(node)) {
              sectionContent.push(node);
            } else if (node.tagName === 'BLOCKQUOTE' && !sectionContent.includes(node)) {
              sectionContent.push(node);
            } else if (node.classList && node.classList.contains('cmp-image') && !sectionContent.includes(node)) {
              sectionContent.push(node);
            }
          }
          // If text node and not empty, add as text node
          if (node.nodeType === 3 && node.textContent.trim()) {
            sectionContent.push(document.createTextNode(node.textContent));
          }
          node = node.nextSibling;
        }
        // If no content, try immediate nextElementSibling paragraphs as fallback
        if (sectionContent.length === 0) {
          let sib = h2.closest('.cmp-title').nextElementSibling;
          while (sib && sib.tagName === 'P') {
            sectionContent.push(sib);
            sib = sib.nextElementSibling;
          }
        }
        // If still empty, at least provide empty string
        cells.push([titleText, sectionContent.length ? sectionContent : '']);
      }
    }
  }

  // Only output the block if at least one accordion item
  if (cells.length > 1) {
    const table = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(table);
  }
}
