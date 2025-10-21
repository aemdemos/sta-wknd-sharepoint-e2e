/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main contentfragment article
  const cfArticle = element.querySelector('article.cmp-contentfragment');
  if (!cfArticle) return;

  // Get the contentfragment elements container
  const cfElements = cfArticle.querySelector('.cmp-contentfragment__elements');
  if (!cfElements) return;

  // Get all children of cfElements
  const cfChildren = Array.from(cfElements.children);

  // We'll collect cards as [image, text] arrays
  const cards = [];

  // Helper to find the next .image .cmp-image element after a given index
  function findNextImage(startIdx) {
    for (let i = startIdx; i < cfChildren.length; i++) {
      if (cfChildren[i].querySelector) {
        const imgDiv = cfChildren[i].querySelector('.image');
        if (imgDiv) {
          const cmpImg = imgDiv.querySelector('.cmp-image');
          if (cmpImg) return { el: cmpImg, idx: i };
        }
      }
    }
    return null;
  }

  // Helper to find the next paragraph after a given index
  function findNextParagraph(startIdx) {
    for (let i = startIdx; i < cfChildren.length; i++) {
      if (cfChildren[i].tagName === 'P') {
        return { el: cfChildren[i], idx: i };
      }
    }
    return null;
  }

  // Step 1: Find the intro card (first image and first paragraph before any h2)
  let introImage = null;
  let introText = null;
  let firstH2Idx = cfChildren.findIndex(c => c.tagName === 'H2');
  let introImgObj = findNextImage(0);
  let introParaObj = findNextParagraph(0);
  if (
    introImgObj &&
    introParaObj &&
    (firstH2Idx === -1 || (introImgObj.idx < firstH2Idx && introParaObj.idx < firstH2Idx))
  ) {
    introImage = introImgObj.el;
    introText = introParaObj.el;
    cards.push([introImage, introText]);
  }

  // Step 2: For each card section (h2, image, paragraph)
  let i = firstH2Idx;
  while (i >= 0 && i < cfChildren.length) {
    // Find h2
    if (cfChildren[i].tagName === 'H2') {
      const cardTitleEl = cfChildren[i];
      // Find next image
      const imgObj = findNextImage(i + 1);
      // Find next paragraph after image
      let descObj = null;
      if (imgObj) {
        descObj = findNextParagraph(imgObj.idx + 1);
      }
      if (imgObj && descObj) {
        // Compose text cell: title (h2) + description (p)
        const textCell = document.createElement('div');
        textCell.appendChild(cardTitleEl.cloneNode(true));
        textCell.appendChild(descObj.el.cloneNode(true));
        cards.push([imgObj.el, textCell]);
        i = descObj.idx + 1;
        continue;
      }
    }
    i++;
  }

  // Table header
  const headerRow = ['Cards (cards33)'];
  const tableRows = [headerRow];
  // Add each card row
  cards.forEach(([img, txt]) => {
    tableRows.push([img, txt]);
  });

  // Only output if there is at least one card row
  if (tableRows.length > 1) {
    // Create block table
    const block = WebImporter.DOMUtils.createTable(tableRows, document);
    // Replace the original element
    element.replaceWith(block);
  }
}
