import DocBreadcrumbs from '@theme-original/DocBreadcrumbs'

import DocPageActions from '../../components/DocPageActions'

// DocBreadcrumbs also renders on generated-index category pages, which have no
// doc context. This site does not use them, so useDoc() inside the actions is safe.
export default function DocBreadcrumbsWrapper() {
  return (
    <div className="surgio-doc-header">
      <DocBreadcrumbs />
      <DocPageActions />
    </div>
  )
}
