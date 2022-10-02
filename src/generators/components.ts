/**
 * 组件生成器
 */
import * as fs from 'fs'
import * as path from 'path'
import { firstUpperCase, getCssModuleExt } from '../utils'

const tsx = ({ name }) => `import { FC, memo } from "react"
import { Btn } from "./style"

type ${firstUpperCase(name)}Props = {
  styleConfig?: {
  };
  type?: "primary" | "normal" | "disabled";
  onClick?: () => void;
}

const ${firstUpperCase(name)}: FC<${firstUpperCase(name)}Props> = memo((props) => {
  const { children,type, styleConfig, onClick } = props

  return (
    <Btn typeName={type} {...styleConfig} onClick={onClick}>
      {children}
    </Btn>
  )
})

export default ${firstUpperCase(name)}
`

const style = () =>
  `import { styled } from "linaria/lib/react"

  type BtnProps = {
  }
  
  export const Btn = styled()<BtnProps>
  `

function writeFileErrorHandler(err) {
  if (err) throw err
}

//生产
/**
 *
 * @param component 组件名称 可能是  index/Banner  也可能是Banner
 * @param componentDir   组件文件夹
 */
export function ComponentGenerator({
  pageComponentCssModule,
  component,
  appPath,
  chalk,
  cssExt,
}: any) {
  let pageName
  let componentName
  const componentInfos = component.split('/')
  if (componentInfos.length !== 1 && componentInfos.length !== 2) {
    throw '组件参数必须是 【组件名称】或者 【页面文件夹/组件名称】'
  }
  if (componentInfos.length === 1) {
    componentName = componentInfos[0]
  }
  if (componentInfos.length === 2) {
    pageName = componentInfos[0]
    componentName = componentInfos[1]
    //检测页面是否存在
    const pageDir = path.join(appPath, 'src', 'pages', pageName)
    if (!fs.existsSync(pageDir)) {
      return console.log(chalk.red(`页面目录【${pageDir}】不存在，无法创建页面组件！`))
    }
  }

  componentName = firstUpperCase(componentName)
  //创建目录
  if (pageName) {
    const componentDir = path.join(appPath, 'src', 'pages', pageName, 'components')
    fs.mkdirSync(componentDir, { recursive: true })
    fs.writeFile(
      path.join(componentDir, `index.tsx`),
      tsx({
        name: componentName,
      }),
      writeFileErrorHandler
    )
    console.log(chalk.green('创建成功=>' + path.join(componentDir, `index.tsx`)))
    // index.${cssExt}
    fs.writeFile(path.join(componentDir, `style.ts`), style(), writeFileErrorHandler)
    console.log(chalk.green('创建成功=>' + path.join(componentDir, `style.ts`)))

    console.log(chalk.green(`页面组件【${pageName}/components/${componentName}】创建成功`))
  } else {
    //项目组件
    const componentDir = path.join(appPath, 'src', 'components', componentName)
    fs.mkdirSync(componentDir, { recursive: true })
    // index.tsx
    fs.writeFile(
      path.join(componentDir, `index.tsx`),
      tsx({ name: componentName }),
      writeFileErrorHandler
    )
    console.log(chalk.green('创建成功=>' + path.join(componentDir, `index.tsx`)))
    // index.${cssExt}
    fs.writeFile(path.join(componentDir, `style.ts`), style(), writeFileErrorHandler)
    console.log(chalk.green('创建成功=>' + path.join(componentDir, `style.ts`)))
    console.log(chalk.green(`项目组件【${componentName}】创建成功`))
  }
}
