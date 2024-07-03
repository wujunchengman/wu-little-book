---
title: 升级到UmiJS4
---

> 公司的一个前端项目用了AndDesign Pro V5，想着跟着大公司走，能够有所参照，不过后来还是停更了。Umi4和AntDesign5都已经发布了，为了保持项目的活性，还是升下级。考虑先升级UmiJS4，没啥问题了再升级AntDesign5

## package.json的调整

因为package里面的东西比较多，所以分部分说。

### 非依赖部分

AndDesignPro的Github仓库已经有6.0.0beta版本了，因此除了dependencies和devDependencies部分可以直接拷贝仓库中的，如果有自定义的配置，拷过来即可
```javascript
  "scripts": {
    "analyze": "cross-env ANALYZE=1 max build",
    "build": "max build",
    "deploy": "npm run build && npm run gh-pages",
    "dev": "npm run start:dev",
    "gh-pages": "gh-pages -d dist",
    "i18n-remove": "pro i18n-remove --locale=zh-CN --write",
    "postinstall": "max setup",
    "jest": "jest",
    "lint": "npm run lint:js && npm run lint:prettier && npm run tsc",
    "lint-staged": "lint-staged",
    "lint-staged:js": "eslint --ext .js,.jsx,.ts,.tsx ",
    "lint:fix": "eslint --fix --cache --ext .js,.jsx,.ts,.tsx --format=pretty ./src ",
    "lint:js": "eslint --cache --ext .js,.jsx,.ts,.tsx --format=pretty ./src",
    "lint:prettier": "prettier -c --write \"**/**.{js,jsx,tsx,ts,less,md,json}\" --end-of-line auto",
    "openapi": "max openapi",
    "prepare": "husky install",
    "prettier": "prettier -c --write \"**/**.{js,jsx,tsx,ts,less,md,json}\"",
    "preview": "npm run build && max preview --port 8000",
    "record": "cross-env NODE_ENV=development REACT_APP_ENV=test max record --scene=login",
    "serve": "umi-serve",
    "start": "cross-env UMI_ENV=dev max dev",
    "start:dev": "cross-env REACT_APP_ENV=dev MOCK=none UMI_ENV=dev max dev",
    "start:no-mock": "cross-env MOCK=none UMI_ENV=dev max dev",
    "start:pre": "cross-env REACT_APP_ENV=pre UMI_ENV=dev max dev",
    "start:test": "cross-env REACT_APP_ENV=test MOCK=none UMI_ENV=dev max dev",
    "test": "jest",
    "test:coverage": "npm run jest -- --coverage",
    "test:update": "npm run jest -- -u",
    "tsc": "tsc --noEmit"
  },
  "lint-staged": {
    "**/*.{js,jsx,ts,tsx}": "npm run lint-staged:js",
    "**/*.{js,jsx,tsx,ts,less,md,json}": [
      "prettier --write"
    ]
  },
  "browserslist": [
    "> 1%",
    "last 2 versions",
    "not ie <= 10"
  ],

```

```javascript
  "engines": {
    "node": ">=12.0.0"
  },
  "create-umi": {
    "ignoreScript": [
      "docker*",
      "functions*",
      "site",
      "generateMock"
    ],
    "ignoreDependencies": [
      "netlify*",
      "serverless"
    ],
    "ignore": [
      ".dockerignore",
      ".git",
      ".github",
      ".gitpod.yml",
      "CODE_OF_CONDUCT.md",
      "Dockerfile",
      "Dockerfile.*",
      "lambda",
      "LICENSE",
      "netlify.toml",
      "README.*.md",
      "azure-pipelines.yml",
      "docker",
      "CNAME",
      "create-umi"
    ]
  }
```

这里最大的变化就是umi的启动指令变了、测试的指令变了、prettier通配符更加细致了、删除了gitHooks的配置、增加了create-umi的配置


### 依赖部分

因为本次只考虑升级umijs，因此不能直接使用Github中的，这里需要手动操作

- react-dev-inspector从dependencies移动到devDependencies
- 移除dependencies中的umi，移除devDependencies中的umi-plugin-，@umijs/plugin- 和 @umijs/preset- 开头的所有依赖。
- devDependencies增加@umijs/max、husky和umi-presets-pro
```javascript
    "husky": "^7.0.4",
    "umi-presets-pro": "^2.0.3",
    "@umijs/max": "^4.0.0"

```

升级过后可能有些包已经没用了，但是这里先不慌，先就这样，后续看看有没有其他问题

## Config


## app.tsx

升级到umijs4后initialStateConfig已经没有了，要删掉

```typescript
/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading />,
};
```

request前置url也已经变了
```javascript
export const request: RequestConfig = {
  // 配置umi-request的前置url
  baseURL: "http://localhoast:5000",
  // umijs4已经换成了axios，这种配置失效了
  // prefix: UserExtensionConfig.BaseUrl,
}
```
原本使用的prefix，现在则是直接透传axios的配置，因此要使用baseURL进行设置了


