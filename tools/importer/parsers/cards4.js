/* global WebImporter */
export default function parse(element, { document }) {
  // Find the 'Members Only' section title
  const allTitles = Array.from(element.querySelectorAll('.cmp-title'));
  const membersTitle = allTitles.find(t => t.textContent.trim().toLowerCase() === 'members only');
  if (!membersTitle) return;

  // Find the two card teasers after the separator (Alaskan Adventure, Fly Fishing the Amazon)
  // Find the separator first
  const separator = element.querySelector('.cmp-separator');
  let cardTeasers = [];
  if (separator) {
    let current = separator.parentElement.nextElementSibling;
    while (current) {
      if (current.classList.contains('teaser')) {
        cardTeasers.push(current);
      }
      // Only collect teasers until another block or grid column
      if (cardTeasers.length === 2) break;
      current = current.nextElementSibling;
    }
  }

  // Helper to extract image from a teaser
  function getTeaserImage(teaser) {
    const imgDiv = teaser.querySelector('.cmp-teaser__image');
    if (!imgDiv) return '';
    const img = imgDiv.querySelector('img');
    return img || '';
  }

  // Helper to extract text content from a teaser
  function getTeaserText(teaser) {
    const content = teaser.querySelector('.cmp-teaser__content');
    if (!content) return '';
    // Title
    const title = content.querySelector('.cmp-teaser__title');
    // Description
    const desc = content.querySelector('.cmp-teaser__description');
    // CTA (may be a link or just text)
    let cta = content.querySelector('.cmp-teaser__action-container');
    // Compose
    const frag = document.createElement('div');
    if (title) frag.appendChild(title.cloneNode(true));
    if (desc) frag.appendChild(desc.cloneNode(true));
    if (cta) {
      // If CTA is just text, wrap in <p>
      if (cta.querySelector('a')) {
        frag.appendChild(cta.querySelector('a').cloneNode(true));
      } else if (cta.textContent.trim()) {
        const p = document.createElement('p');
        p.textContent = cta.textContent.trim();
        frag.appendChild(p);
      }
    }
    return frag;
  }

  // Compose rows for the table
  const headerRow = ['Cards (cards4)'];
  const rows = [headerRow];

  // For each teaser, add a row: [image, text content]
  cardTeasers.forEach(teaser => {
    const img = getTeaserImage(teaser);
    const text = getTeaserText(teaser);
    rows.push([img, text]);
  });

  // Create the table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Insert table before the first card teaser
  if (cardTeasers.length) {
    cardTeasers[0].parentElement.insertBefore(table, cardTeasers[0]);
    // Remove the original card teasers
    cardTeasers.forEach(card => card.remove());
  }
}
