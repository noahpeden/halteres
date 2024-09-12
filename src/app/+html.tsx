import type { PropsWithChildren } from 'react'

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
        <title>Expo Router Typescript</title>

        <link rel="canonical" href="https://halteres.ai" />
        {/* <link rel="image_src" href="https://halteres.ai/og-image.jpg" /> */}
        <meta name="title" content="Expo Router Typescript" />
        <meta name="description" content="The number one workout programming app for professionals in the functional fitness community" />
        <meta name="robots" content="index, follow" />
        <meta
          name="keywords"
          content="functional fitness, ai, crossfit, personal training, workout generation, workout programming, wods, wod, workout of the day, halteres, halteres.ai"
        />
        <meta name="author" content="The Dev Environment, Inc." />
        <meta name="publisher" content="The Dev Environment, Inc." />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://halteres.ai" />
        <meta property="og:title" content="Expo Router Typescript" />
        <meta property="og:description" content="The number one workout programming app for professionals in the functional fitness community" />
        {/* <meta property="og:image" content="https://halteres.ai/og-image.jpg" /> */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://halteres.ai" />
        <meta property="twitter:title" content="Expo Router Typescript" />
        <meta property="twitter:description" content="An expo app built using Expo Router Typescript" />
        {/* <meta property="twitter:image" content="https://halteres.ai/og-image.jpg" /> */}
      </head>
      <body>{children}</body>
    </html>
  )
}
