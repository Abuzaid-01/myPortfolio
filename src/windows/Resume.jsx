import { useEffect, useRef, useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import { Download, ExternalLink, Minus, Plus } from 'lucide-react'
import { resumeFile } from '@/constants'

pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString()

const ZOOMS = [0.6, 0.8, 1, 1.25, 1.5, 2]

function ToolBtn({ label, onClick, disabled, children, href, ...rest }) {
  const cls =
    'grid h-7 min-w-7 place-items-center rounded-md px-1.5 text-white/75 transition hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent'
  if (href) {
    return (
      <a href={href} aria-label={label} title={label} className={cls} {...rest}>
        {children}
      </a>
    )
  }
  return (
    <button aria-label={label} title={label} onClick={onClick} disabled={disabled} className={cls}>
      {children}
    </button>
  )
}

export default function Resume() {
  const wrap = useRef(null)
  const [width, setWidth] = useState(0)
  const [zoomIdx, setZoomIdx] = useState(2) // 100% = fit width
  const [pages, setPages] = useState(0)
  const [failed, setFailed] = useState(false)

  // fit-to-width: the page tracks the window size
  useEffect(() => {
    const ro = new ResizeObserver(([e]) => setWidth(Math.floor(e.contentRect.width)))
    ro.observe(wrap.current)
    return () => ro.disconnect()
  }, [])

  const zoom = ZOOMS[zoomIdx]

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex shrink-0 items-center gap-1 border-b border-white/10 bg-white/[0.03] px-2 py-1">
        <ToolBtn label="Zoom out" onClick={() => setZoomIdx((i) => Math.max(0, i - 1))} disabled={zoomIdx === 0}>
          <Minus size={15} />
        </ToolBtn>
        <button
          onClick={() => setZoomIdx(2)}
          title="Fit to width"
          className="h-7 w-12 rounded-md text-xs tabular-nums text-white/70 hover:bg-white/10"
        >
          {Math.round(zoom * 100)}%
        </button>
        <ToolBtn label="Zoom in" onClick={() => setZoomIdx((i) => Math.min(ZOOMS.length - 1, i + 1))} disabled={zoomIdx === ZOOMS.length - 1}>
          <Plus size={15} />
        </ToolBtn>

        <span className="ml-2 hidden truncate text-xs text-white/40 sm:block">
          Abuzaid_Resume.pdf{pages > 0 ? ` · ${pages} page${pages > 1 ? 's' : ''}` : ''}
        </span>

        <div className="ml-auto flex items-center gap-1">
          <ToolBtn label="Open in new tab" href={resumeFile} target="_blank" rel="noopener noreferrer">
            <ExternalLink size={15} />
          </ToolBtn>
          <a
            href={resumeFile}
            download="Abuzaid_Resume.pdf"
            className="flex h-7 items-center gap-1.5 rounded-md bg-accent px-2.5 text-xs font-medium text-white transition hover:brightness-110"
          >
            <Download size={13} /> Download
          </a>
        </div>
      </div>

      <div ref={wrap} className="min-h-0 flex-1 select-text overflow-auto bg-black/35 p-3 @container">
        {failed ? (
          <div className="grid h-full place-items-center text-center text-sm text-white/55">
            <div>
              <p className="font-medium text-white/80">Couldn&apos;t load the resume.</p>
              <p className="mt-1">
                Put your PDF at <code className="rounded bg-white/10 px-1">public/Abuzaid_Resume.pdf</code>
              </p>
            </div>
          </div>
        ) : (
          <Document
            file={resumeFile}
            onLoadSuccess={({ numPages }) => setPages(numPages)}
            onLoadError={() => setFailed(true)}
            loading={<div className="grid h-40 place-items-center text-sm text-white/45">Loading resume…</div>}
            error={null}
          >
            <div className="mx-auto w-fit">
              {width > 0 &&
                Array.from({ length: pages }, (_, i) => (
                  <Page
                    key={i}
                    pageNumber={i + 1}
                    width={Math.max(260, width) * zoom}
                    className="mb-3 overflow-hidden rounded shadow-2xl shadow-black/60"
                  />
                ))}
            </div>
          </Document>
        )}
      </div>
    </div>
  )
}
