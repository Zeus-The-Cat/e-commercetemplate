import Head from 'next/head';

export default function Metatags({
  title = 'E-Commerce Portfolio - Dakotah Pettry ',
  description = 'Authentication via Next.js and payment via Stripe',
  image = 'https://fireship.io/courses/react-next-firebase/img/featured.png',
}) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="twitter:card" content="Portfolio Piece" />
      <meta name="twitter:site" content="@dakotah_pettry" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
    </Head>
  )
}