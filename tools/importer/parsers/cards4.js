/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract card info from a teaser block
  function extractTeaserCard(teaser, includeLockIcon = false) {
    // Pretitle (e.g., 'Featured Article')
    const pretitle = teaser.querySelector('.cmp-teaser__pretitle');
    // Image: find .cmp-teaser__image img
    const img = teaser.querySelector('.cmp-teaser__image img');
    // Title: find .cmp-teaser__title
    const title = teaser.querySelector('.cmp-teaser__title');
    // Description: find .cmp-teaser__description
    const desc = teaser.querySelector('.cmp-teaser__description');
    // CTA: find .cmp-teaser__action-link or .cmp-teaser__action-container (if text only)
    let cta = teaser.querySelector('.cmp-teaser__action-link');
    if (!cta) {
      cta = teaser.querySelector('.cmp-teaser__action-container');
    }
    // Compose text cell
    const textCell = document.createElement('div');
    if (pretitle) textCell.appendChild(pretitle.cloneNode(true));
    if (title) textCell.appendChild(title.cloneNode(true));
    if (desc) textCell.appendChild(desc.cloneNode(true));
    if (cta) textCell.appendChild(cta.cloneNode(true));
    // Compose image/icon cell
    let iconCell;
    if (includeLockIcon) {
      // Create lock icon (yellow square with lock emoji)
      const iconDiv = document.createElement('div');
      iconDiv.style.display = 'inline-block';
      iconDiv.style.background = '#ffe600';
      iconDiv.style.width = '24px';
      iconDiv.style.height = '24px';
      iconDiv.style.textAlign = 'center';
      iconDiv.style.verticalAlign = 'middle';
      iconDiv.style.lineHeight = '24px';
      iconDiv.style.marginBottom = '8px';
      iconDiv.textContent = '🔒';
      iconCell = document.createElement('div');
      iconCell.appendChild(iconDiv);
      if (img) iconCell.appendChild(img.cloneNode(true));
    } else {
      iconCell = img ? img.cloneNode(true) : '';
    }
    return [iconCell, textCell];
  }

  // Helper to extract card info from image-list li
  function extractImageListCard(li) {
    // Image: .cmp-image-list__item-image img
    const img = li.querySelector('.cmp-image-list__item-image img');
    // Title: .cmp-image-list__item-title
    const title = li.querySelector('.cmp-image-list__item-title');
    // Description: .cmp-image-list__item-description
    const desc = li.querySelector('.cmp-image-list__item-description');
    // CTA: .cmp-image-list__item-title-link (use as link for title)
    const link = li.querySelector('.cmp-image-list__item-title-link');
    // Compose text cell
    const textCell = document.createElement('div');
    if (title && link) {
      const a = link.cloneNode(true);
      a.querySelectorAll('img').forEach(img => img.remove());
      textCell.appendChild(a);
    } else if (title) {
      textCell.appendChild(title.cloneNode(true));
    }
    if (desc) textCell.appendChild(desc.cloneNode(true));
    return [img ? img.cloneNode(true) : '', textCell];
  }

  // Compose table rows
  const headerRow = ['Cards (cards4)'];
  const rows = [headerRow];

  // Add main heading: Magazine
  const magazineHeading = element.querySelector('.cmp-title h1');
  if (magazineHeading) {
    const textCell = document.createElement('div');
    textCell.appendChild(magazineHeading.cloneNode(true));
    rows.push(['', textCell]);
  }

  // Featured card (teaser.cmp-teaser--featured)
  const featuredTeaser = element.querySelector('.teaser.cmp-teaser--featured');
  if (featuredTeaser) {
    rows.push(extractTeaserCard(featuredTeaser));
  }

  // Add section heading: All Articles
  const allArticlesHeading = Array.from(element.querySelectorAll('.cmp-title--underline h2')).find(h2 => h2.textContent.trim().toLowerCase().includes('all articles'));
  if (allArticlesHeading) {
    const textCell = document.createElement('div');
    textCell.appendChild(allArticlesHeading.cloneNode(true));
    rows.push(['', textCell]);
  }

  // Add image-list cards (All Articles)
  const imageList = element.querySelector('.image-list .cmp-image-list');
  const imageListCards = imageList ? Array.from(imageList.querySelectorAll('.cmp-image-list__item')) : [];
  imageListCards.forEach(li => {
    rows.push(extractImageListCard(li));
  });

  // Add section heading: Members Only
  const membersOnlyHeading = Array.from(element.querySelectorAll('.cmp-title--underline h2')).find(h2 => h2.textContent.trim().toLowerCase().includes('members only'));
  if (membersOnlyHeading) {
    const textCell = document.createElement('div');
    textCell.appendChild(membersOnlyHeading.cloneNode(true));
    rows.push(['', textCell]);
  }

  // Add sign-in prompt (as a card row, with an icon for visual parity)
  const signInPrompt = element.querySelector('.cmp-text p');
  if (signInPrompt) {
    // Use a lock icon for the prompt
    const iconDiv = document.createElement('div');
    iconDiv.style.display = 'inline-block';
    iconDiv.style.background = '#ffe600';
    iconDiv.style.width = '24px';
    iconDiv.style.height = '24px';
    iconDiv.style.textAlign = 'center';
    iconDiv.style.verticalAlign = 'middle';
    iconDiv.style.lineHeight = '24px';
    iconDiv.style.marginBottom = '8px';
    iconDiv.textContent = '🔒';
    const iconCell = document.createElement('div');
    iconCell.appendChild(iconDiv);
    const textCell = document.createElement('div');
    textCell.appendChild(signInPrompt.cloneNode(true));
    rows.push([iconCell, textCell]);
  }

  // Add teaser cards (Members Only, with lock icon)
  const teaserCards = Array.from(element.querySelectorAll('.teaser.cmp-teaser--list'));
  teaserCards.forEach(teaser => {
    rows.push(extractTeaserCard(teaser, true));
  });

  // Replace element with table if any cards found
  if (rows.length > 1) {
    const table = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(table);
  }
}
