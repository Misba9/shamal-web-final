import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  type?: 'website' | 'article';
  name?: string;
  image?: string;
  schema?: Record<string, any>;
}

export function SEO({ 
  title, 
  description, 
  canonical, 
  type = 'website', 
  name = 'Shamal Technologies', 
  image = '/sa.svg',
  schema 
}: SEOProps) {
  const siteUrl = 'https://shamal.sa';
  const fullTitle = `${title} | Shamal Technologies`;

  // Default Organization Schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Shamal Technologies",
    "url": siteUrl,
    "logo": `${siteUrl}/logo-primary.svg`,
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+966-53-030-1370",
      "contactType": "customer service",
      "areaServed": "SA",
      "availableLanguage": ["en", "ar"]
    },
    "sameAs": [
      "https://linkedin.com/company/shamal-technologies",
      "https://twitter.com/shamaltech"
    ]
  };

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical ? `${siteUrl}${canonical}` : siteUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonical ? `${siteUrl}${canonical}` : siteUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`${siteUrl}${image}`} />
      <meta property="og:site_name" content={name} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${siteUrl}${image}`} />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(schema || organizationSchema)}
      </script>
    </Helmet>
  );
}
