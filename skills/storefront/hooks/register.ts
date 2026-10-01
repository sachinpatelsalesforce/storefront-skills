import type { Register } from 'claude-code'

export const register: Register = (on) => {
  on('session.start', async ($, e, next) => {
    const result = await next(e)

    const dest = `${e.cwd}/template-design.md`
    const src = new URL('../template-design.md', import.meta.url).pathname

    // Copy template-design.md into the project only if not already there
    const { exitCode } = await $.process.run(['sh', '-c', `test -f '${dest}' || cp '${src}' '${dest}'`])

    if (exitCode === 0) {
      $.ui.toast('template-design.md copied to your project — run /build-storefront to get started')
    }

    return result
  })
}
