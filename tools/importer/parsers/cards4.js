/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get all direct children with a specific class (for robust selection)
  function getDirectChildrenByClass(parent, className) {
    return Array.from(parent.children).filter(child => child.classList.contains(className));
  }

  // Extract a card from a cmp-image-list__item
  function extractCardFromImageListItem(li) {
    const imgDiv = li.querySelector('.cmp-image-list__item-image .cmp-image');
    const img = imgDiv ? imgDiv.querySelector('img') : null;
    const titleLink = li.querySelector('.cmp-image-list__item-title-link');
    const titleSpan = titleLink ? titleLink.querySelector('.cmp-image-list__item-title') : null;
    const descSpan = li.querySelector('.cmp-image-list__item-description');
    // Build content cell
    const content = [];
    if (titleSpan) {
      const h = document.createElement('h3');
      h.textContent = titleSpan.textContent.trim();
      content.push(h);
    }
    if (descSpan && descSpan.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = descSpan.textContent.trim();
      content.push(p);
    }
    // Only create link if it's a real link and not just a wrapper
    if (titleLink && titleLink.href) {
      const a = document.createElement('a');
      a.href = titleLink.href;
      a.textContent = (titleSpan && titleSpan.textContent.trim()) || 'Read More';
      content.push(a);
    }
    return [img, content];
  }

  // Extract a card from a cmp-teaser
  function extractCardFromTeaser(teaserDiv) {
    const imgDiv = teaserDiv.querySelector('.cmp-teaser__image .cmp-image');
    const img = imgDiv ? imgDiv.querySelector('img') : null;
    const title = teaserDiv.querySelector('.cmp-teaser__title');
    const desc = teaserDiv.querySelector('.cmp-teaser__description');
    let ctaLink = teaserDiv.querySelector('.cmp-teaser__action-link');
    let ctaText = null;
    if (!ctaLink) {
      const ctaDiv = teaserDiv.querySelector('.cmp-teaser__action-container');
      if (ctaDiv && ctaDiv.textContent.trim()) {
        ctaText = ctaDiv.textContent.trim();
      }
    }
    const content = [];
    if (title) {
      const h = document.createElement('h3');
      h.textContent = title.textContent.trim();
      content.push(h);
    }
    if (desc) {
      // Description can be <div> or <div><p/></div>
      if (desc.children.length === 1 && desc.children[0].tagName === 'P') {
        // Use existing <p> (reference it)
        content.push(desc.children[0]);
      } else {
        // Otherwise, create a <p> with text (if not empty)
        if (desc.textContent.trim()) {
          const p = document.createElement('p');
          p.textContent = desc.textContent.trim();
          content.push(p);
        }
      }
    }
    if (ctaLink) {
      content.push(ctaLink);
    } else if (ctaText) {
      // Only add CTA as text if it's not empty and not just 'Read More' placeholder
      const txt = ctaText.trim();
      if (txt && txt.toLowerCase() !== 'read more') {
        const span = document.createElement('span');
        span.textContent = txt;
        content.push(span);
      }
    }
    return [img, content];
  }

  const cells = [['Cards (cards4)']];
  // 1. Find the featured teaser (cmp-teaser--featured > .cmp-teaser)
  const featuredTeaserCol = element.querySelector('.cmp-teaser--featured');
  if (featuredTeaserCol) {
    const featuredTeaser = featuredTeaserCol.querySelector('.cmp-teaser');
    if (featuredTeaser) {
      cells.push(extractCardFromTeaser(featuredTeaser));
    }
  }
  // 2. All Articles - image list
  const imageList = element.querySelector('.cmp-image-list');
  if (imageList) {
    imageList.querySelectorAll('.cmp-image-list__item').forEach(li => {
      cells.push(extractCardFromImageListItem(li));
    });
  }
  // 3. Find all member-only teasers (cmp-teaser--list & cmp-teaser--secure)
  // These are not always direct siblings, so query for any such pair
  const memberTeasers = Array.from(element.querySelectorAll('.cmp-teaser--list.cmp-teaser--secure'));
  memberTeasers.forEach(teaserCol => {
    const teaser = teaserCol.querySelector('.cmp-teaser');
    if (teaser) {
      cells.push(extractCardFromTeaser(teaser));
    }
  });
  // Build and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
