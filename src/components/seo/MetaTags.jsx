// src/components/seo/MetaTags.jsx
import { Helmet } from 'react-helmet-async'

export default function MetaTags({ 
  title, 
  description, 
  keywords, 
  canonicalUrl 
}) {
  return (
    <Helmet>
      <title>{title} | CalcPro</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
    </Helmet>
  )
}