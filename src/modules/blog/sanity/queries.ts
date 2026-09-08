/** Listing/summary projection — excludes heavy body fields. */
export const blogPostSummaryProjection = `{
  _id,
  title,
  "slug": slug.current,
  locale,
  excerpt,
  coverUrl,
  coverUrlAlt,
  cover{
    asset->{
      _id,
      url,
      metadata{ dimensions }
    },
    alt,
    caption,
    hotspot,
    crop
  },
  author->{
    name,
    role,
    image{
      asset->{
        _id,
        url,
        metadata{ dimensions }
      },
      alt,
      caption,
      hotspot,
      crop
    }
  },
  category->{
    "categoryId": categoryId.current,
    label
  },
  publishedAt,
  updatedAt,
  featured,
  seo,
  relatedServiceId,
  "relatedPosts": relatedPosts[]->{
    "slug": slug.current
  },
  readingTimeMinutes
}`;

/** Full article projection including body payloads. */
export const blogPostProjection = `{
  _id,
  title,
  "slug": slug.current,
  locale,
  excerpt,
  coverUrl,
  coverUrlAlt,
  cover{
    asset->{
      _id,
      url,
      metadata{ dimensions }
    },
    alt,
    caption,
    hotspot,
    crop
  },
  author->{
    name,
    role,
    image{
      asset->{
        _id,
        url,
        metadata{ dimensions }
      },
      alt,
      caption,
      hotspot,
      crop
    }
  },
  category->{
    "categoryId": categoryId.current,
    label
  },
  publishedAt,
  updatedAt,
  featured,
  seo,
  body[]{
    ...,
    _type == "image" => {
      ...,
      asset->{
        _id,
        url,
        metadata{ dimensions }
      }
    },
    _type == "blogImageBlock" => {
      ...,
      image{
        asset->{
          _id,
          url,
          metadata{ dimensions }
        },
        alt,
        caption,
        hotspot,
        crop
      }
    },
    _type == "twoColumn" => {
      ...,
      left[]{ ... },
      right[]{ ... }
    }
  },
  bodyFormat,
  bodyJson,
  bodyHtml,
  relatedServiceId,
  "relatedPosts": relatedPosts[]->{
    "slug": slug.current
  },
  readingTimeMinutes
}`;

const publishedFilter = `
  _type == "blogPost"
  && locale == "ar"
  && defined(slug.current)
  && !(_id in path("drafts.**"))
  && defined(publishedAt)
  && publishedAt <= now()
`;

export const publishedPostsQuery = `*[${publishedFilter}] | order(featured desc, publishedAt desc) ${blogPostSummaryProjection}`;

export const publishedPostsCountQuery = `count(*[${publishedFilter}])`;

export const featuredPublishedPostQuery = `*[
  ${publishedFilter}
  && featured == true
] | order(publishedAt desc)[0] ${blogPostSummaryProjection}`;

export const newestPublishedPostQuery = `*[
  ${publishedFilter}
] | order(publishedAt desc)[0] ${blogPostSummaryProjection}`;

/** Paginated listing rows excluding the featured slug when provided. */
export const listingPostsPageQuery = `*[
  ${publishedFilter}
  && ($excludeSlug == "" || slug.current != $excludeSlug)
] | order(publishedAt desc)[$start...$end] ${blogPostSummaryProjection}`;

export const publishedPostBySlugQuery = `*[
  ${publishedFilter}
  && slug.current == $slug
][0] ${blogPostProjection}`;

export const relatedPostsQuery = `*[
  ${publishedFilter}
  && slug.current != $slug
] | order(
  select(category->categoryId.current == $categoryId => 0, 1) asc,
  publishedAt desc
)[0...$limit] ${blogPostSummaryProjection}`;
