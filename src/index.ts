import Server from './Server'
import { getMockConfigs, parseMockApi, createMockMiddleware } from './utils'

export default (ctx, opts) => {
  ctx.onBuildFinish(() => {
    const { appPath } = ctx.paths

    const mockConfigs = getMockConfigs({
      appPath,
      pluginOpts: opts
    })
    const mockApis = parseMockApi(mockConfigs)
    const server = new Server({
      middlewares: [
        createMockMiddleware(mockApis)
      ]
    })
    server.start()
  })
}