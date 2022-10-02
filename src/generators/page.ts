/**
 * 组件生成器
 */
import * as fs from 'fs'
import * as path from 'path'
import { firstUpperCase } from '../utils'

/**
 *
 * @param group 页面分组
 * @param name  页面名称
 */
const tsx = ({ name }) => `import { memo, FC } from 'react'
import { View,Text } from '@tarojs/components'

const ${firstUpperCase(name)}: FC = memo(() => {
  return (
    <View>
      <Text>${firstUpperCase(name)}</Text>
    </View>
  )
})

export default ${firstUpperCase(name)}
`

// index.module.less
const style = () =>
  `import { styled } from "linaria/lib/react";
  
  export const View = styled.view;`

const config = () => `export default definePageConfig({
  navigationBarTitleText: 'weChat'
})
`

function writeFileErrorHandler(err) {
  if (err) throw err
}

//生产
/**
 *
 * @param componentName 页面
 * @param componentDir   页面目录
 * @param cssExt:文件后缀
 * @param log 日志工具
 */
export function PageGenerator({ pagePath, appPath, chalk, nocss }: any) {
  //判断页面情况
  const pages = pagePath.split('/')
  if (pages.length !== 1 && pages.length !== 2) {
    throw '页面参数必须是  index或者 index/index'
  }
  let pageGroup = ''
  let pageName = ''
  if (pages.length === 1) {
    pageGroup = pages[0]
    pageName = pages[0]
  }
  if (pages.length === 2) {
    pageGroup = pages[0]
    pageName = pages[1]
  }

  const componentDir = path.join(appPath, 'src', 'pages')
  const dir = path.join(componentDir, pageGroup)

  //创建目录
  fs.mkdirSync(dir, { recursive: true })
  // index.tsx
  fs.writeFile(path.join(dir, `index.tsx`), tsx({ name: pageName }), writeFileErrorHandler)
  console.log(chalk.green('创建成功=>' + path.join(dir, `${pageName}.tsx`)))
  // index.less
  if (!nocss) {
    fs.writeFile(path.join(dir, `style.ts`), style(), writeFileErrorHandler)
    console.log(chalk.green('创建成功=>' + path.join(dir, `style.ts`)))
  }
  // 页面config
  fs.writeFile(path.join(dir, `index.config.ts`), config(), writeFileErrorHandler)
  console.log(chalk.green('创建成功=>' + path.join(dir, `${pageName}.config.ts`)))

  //返回页面名称
  return `pages/${pageGroup}/${pageName}`
}
