/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract image, title, description, and CTA from a card-like element
  function extractCardContent(cardEl) {
    let image = null;
    let title = null;
    let description = null;
    let cta = null;

    // Try to find image
    // For teaser blocks
    const teaserImageDiv = cardEl.querySelector('.cmp-teaser__image .cmp-image__image');
    if (teaserImageDiv) {
      image = teaserImageDiv;
    }
    // For image-list blocks
    const imageListImg = cardEl.querySelector('.cmp-image-list__item-image .cmp-image__image');
    if (imageListImg) {
      image = imageListImg;
    }

    // Try to find title
    // For teaser blocks
    const teaserTitle = cardEl.querySelector('.cmp-teaser__title');
    if (teaserTitle) {
      title = teaserTitle;
    }
    // For image-list blocks
    const imageListTitle = cardEl.querySelector('.cmp-image-list__item-title');
    if (imageListTitle) {
      title = imageListTitle;
    }
    // For featured article pretitle
    const teaserPretitle = cardEl.querySelector('.cmp-teaser__pretitle');
    // For featured article, combine pretitle and title
    if (teaserPretitle && teaserTitle) {
      const wrapper = document.createElement('div');
      wrapper.append(teaserPretitle.cloneNode(true));
      wrapper.append(teaserTitle.cloneNode(true));
      title = wrapper;
    }

    // Try to find description
    // For teaser blocks
    const teaserDesc = cardEl.querySelector('.cmp-teaser__description');
    if (teaserDesc) {
      description = teaserDesc;
    }
    // For image-list blocks
    const imageListDesc = cardEl.querySelector('.cmp-image-list__item-description');
    if (imageListDesc) {
      description = imageListDesc;
    }

    // Try to find CTA
    // For teaser blocks
    const teaserCtaLink = cardEl.querySelector('.cmp-teaser__action-link');
    if (teaserCtaLink) {
      cta = teaserCtaLink;
    }
    // For teaser blocks with action-container but no link (secure teasers)
    const teaserCtaContainer = cardEl.querySelector('.cmp-teaser__action-container');
    if (!cta && teaserCtaContainer && teaserCtaContainer.textContent.trim()) {
      // If the container just has text, create a span
      const ctaSpan = document.createElement('span');
      ctaSpan.textContent = teaserCtaContainer.textContent.trim();
      cta = ctaSpan;
    }

    // For image-list blocks, title is a link
    const imageListTitleLink = cardEl.querySelector('.cmp-image-list__item-title-link');
    if (imageListTitleLink) {
      // If the title is a link, put it as the heading
      title = imageListTitleLink;
    }

    // Compose text cell
    const textCell = [];
    if (title) textCell.push(title);
    if (description) textCell.push(description);
    if (cta) textCell.push(cta);

    return [image, textCell];
  }

  // Find all card sources
  const cards = [];

  // Featured Article (teaser)
  const featuredTeaser = element.querySelector('.teaser.cmp-teaser--featured');
  if (featuredTeaser) {
    cards.push(featuredTeaser);
  }

  // All Articles (image-list)
  const imageList = element.querySelector('.image-list.list ul.cmp-image-list');
  if (imageList) {
    imageList.querySelectorAll(':scope > li.cmp-image-list__item').forEach(li => {
      cards.push(li);
    });
  }

  // Members Only (secure teasers)
  const secureTeasers = element.querySelectorAll('.teaser.cmp-teaser--list.cmp-teaser--secure');
  secureTeasers.forEach(teaser => {
    cards.push(teaser);
  });

  // Compose table rows
  const headerRow = ['Cards (cards4)'];
  const rows = [headerRow];

  cards.forEach(cardEl => {
    const [image, textCell] = extractCardContent(cardEl);
    rows.push([image, textCell]);
  });

  // Create and replace block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
