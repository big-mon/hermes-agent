import { describe, expect, it, vi } from 'vitest'

import { installPreviewPermissionPolicy, PREVIEW_SESSION_PARTITION } from './preview-permissions'

describe('preview permission policy', () => {
  it('denies request and check paths on the isolated preview partition', () => {
    let requestHandler:
      ((webContents: unknown, permission: string, callback: (allowed: boolean) => void) => void) | null = null

    let checkHandler: ((webContents: unknown, permission: string) => boolean) | null = null

    const previewSession = {
      setPermissionRequestHandler: vi.fn(handler => {
        requestHandler = handler
      }),
      setPermissionCheckHandler: vi.fn(handler => {
        checkHandler = handler
      })
    }

    const fromPartition = vi.fn(() => previewSession)

    installPreviewPermissionPolicy(fromPartition)

    expect(fromPartition).toHaveBeenCalledWith(PREVIEW_SESSION_PARTITION)
    const respond = vi.fn()
    requestHandler?.({}, 'clipboard-read', respond)
    expect(respond).toHaveBeenCalledWith(false)
    expect(checkHandler?.({}, 'clipboard-read')).toBe(false)
  })
})
