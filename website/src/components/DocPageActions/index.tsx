import { useEffect, useRef, useState, type FocusEvent, type KeyboardEvent } from 'react'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import { useDoc } from '@docusaurus/plugin-content-docs/client'

import styles from './styles.module.css'

type CopyStatus = 'idle' | 'copied' | 'failed'

const FEEDBACK_DURATION_MS = 2000

const statusLabels: Record<CopyStatus, string> = {
  idle: '复制链接',
  copied: '已复制',
  failed: '复制失败',
}

function useDocLinks() {
  const { siteConfig } = useDocusaurusContext()
  const { metadata } = useDoc()
  const rawBaseUrl = siteConfig.customFields?.siteSourceRawBaseUrl as string

  return {
    pageUrl: new URL(metadata.permalink, siteConfig.url).href,
    markdownUrl: new URL(metadata.source.replace(/^@site\//, ''), rawBaseUrl).href,
  }
}

function useCopyToClipboard() {
  const [status, setStatus] = useState<CopyStatus>('idle')
  const timerRef = useRef<number>(undefined)

  useEffect(() => () => window.clearTimeout(timerRef.current), [])

  const copy = async (text: string) => {
    window.clearTimeout(timerRef.current)
    try {
      await navigator.clipboard.writeText(text)
      setStatus('copied')
    } catch (error) {
      console.error('Failed to copy to clipboard', error)
      setStatus('failed')
    }
    timerRef.current = window.setTimeout(() => setStatus('idle'), FEEDBACK_DURATION_MS)
  }

  return { status, copy }
}

function useDismissableMenu() {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const firstItemRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    firstItemRef.current?.focus()
    const closeOnOutsidePointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', closeOnOutsidePointer)
    return () => document.removeEventListener('pointerdown', closeOnOutsidePointer)
  }, [open])

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key !== 'Escape' || !open) return
    setOpen(false)
    toggleRef.current?.focus()
  }

  const onBlur = (event: FocusEvent) => {
    if (!rootRef.current?.contains(event.relatedTarget as Node | null)) setOpen(false)
  }

  return { open, setOpen, rootRef, toggleRef, firstItemRef, onKeyDown, onBlur }
}

export default function DocPageActions() {
  const { pageUrl, markdownUrl } = useDocLinks()
  const { status, copy } = useCopyToClipboard()
  const menu = useDismissableMenu()

  const copyMarkdownUrl = () => {
    menu.setOpen(false)
    menu.toggleRef.current?.focus()
    void copy(markdownUrl)
  }

  return (
    <div ref={menu.rootRef} className={styles.root} onKeyDown={menu.onKeyDown} onBlur={menu.onBlur}>
      <div className={styles.group}>
        <button type="button" className={styles.primary} onClick={() => void copy(pageUrl)}>
          {status === 'copied' ? <CheckIcon /> : <LinkIcon />}
          <span aria-live="polite">{statusLabels[status]}</span>
        </button>
        <button
          ref={menu.toggleRef}
          type="button"
          className={styles.toggle}
          aria-label="更多复制选项"
          aria-haspopup="menu"
          aria-expanded={menu.open}
          onClick={() => menu.setOpen(!menu.open)}
        >
          <ChevronIcon />
        </button>
      </div>
      <div role="menu" className={styles.menu} data-open={menu.open}>
        <button
          ref={menu.firstItemRef}
          type="button"
          role="menuitem"
          className={styles.item}
          onClick={copyMarkdownUrl}
        >
          <MarkdownIcon />
          <span>
            <span className={styles.itemTitle}>复制 Markdown 链接</span>
            <span className={styles.itemDescription}>复制本页在 GitHub 上的源文件地址</span>
          </span>
        </button>
      </div>
    </div>
  )
}

function LinkIcon() {
  return (
    <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M10 13a5 5 0 0 0 7.07 0l3-3a5 5 0 0 0-7.07-7.07l-1.5 1.5" />
      <path d="M14 11a5 5 0 0 0-7.07 0l-3 3a5 5 0 0 0 7.07 7.07l1.5-1.5" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}

function ChevronIcon() {
  return (
    <svg className={styles.chevron} viewBox="0 0 24 24" aria-hidden="true">
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

function MarkdownIcon() {
  return (
    <svg className={styles.itemIcon} viewBox="0 0 24 24" aria-hidden="true">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M6 15V9l3 3 3-3v6M17 9v6m-2.5-2.5L17 15l2.5-2.5" />
    </svg>
  )
}
