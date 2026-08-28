/**
 * Preview pages are untrusted web content, but agent-driven input is delivered
 * as real Chromium input. Keep that user activation from granting access to
 * native capabilities such as the host clipboard.
 */

export const PREVIEW_SESSION_PARTITION = 'persist:hermes-preview'

interface PreviewPermissionSession {
  setPermissionRequestHandler(
    handler: (_webContents: unknown, _permission: string, callback: (allowed: boolean) => void) => void
  ): void
  setPermissionCheckHandler(handler: (_webContents: unknown, _permission: string) => boolean): void
}

export function installPreviewPermissionPolicy(fromPartition: (partition: string) => PreviewPermissionSession): void {
  const previewSession = fromPartition(PREVIEW_SESSION_PARTITION)

  // Preview content has no supported native permissions. Any future exception
  // must add an explicit, user-mediated authorization path rather than relying
  // on Chromium's permissive default for sessions without handlers.
  previewSession.setPermissionRequestHandler((_webContents, _permission, callback) => {
    callback(false)
  })
  previewSession.setPermissionCheckHandler(() => false)
}
