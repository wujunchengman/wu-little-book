import { defaultTheme, defineUserConfig } from "vuepress";

export default defineUserConfig({
  port: 4624,
  lang: "zh-CN",
  title: "吴俊城",
  description: "知识的总结",
  theme: defaultTheme({
    // 在这里进行配置
    repoLabel: "我的博客",
    repo: "https://cnblogs.com/wujuncheng",
    navbar: [
      // NavbarItem
      {
        text: "C#",
        link: "/CSharp/",
      },
      {
        text: "AspNetCore",
        link: "/AspNetCore/",
      },
      {
        text: "EntityFrameworkCore",
        link: "/EntityFrameworkCore",
      },
      {
        text: "WPF",
        link: "/WPF/",
      },
      // NavbarGroup
      {
        text: "生态项目",
        children: [
          {
            text: "日志",
            children:[
              // {
              //   text:"NLog的基本使用"
              // },
              {
                text:"NLog的配置文件",
                link:"/Ecosystem/NLog/NLogConfigurationFile.md"
              }
            ]
          }],
      },
      {
        text:"Linux",
        link:"/Linux"
      },
      {
        text: "VS Code的插件与玩法",
        link: "vscode",
      },
      {
        text:"Java篇",
        children: [
          {
            text: "Maven",
            link: "/Java/Maven/Install.md"
          },
          {
            text: "Spring Boot",
            link: "/Java/SpringBoot/"
          }
        ]
      }
      // 字符串 - 页面文件路径
      // '/bar/README.md',
    ],
    sidebar: {
      "/CSharp": [
        {
          text: "前言",
          link: "/CSharp/introduction",
          // collapsable: false,
          // children: [
          //   '/introduction',
          // ]
        },
        {
          text: "基础语法",
          link: "/introduction",
          // collapsable: false,
          children: [
            "/introduction",
            "/introduction",
            "/introduction",
            "/introduction",
          ],
        },
      ],
      "/AspNetCore/": [
        {
          text: "鉴权授权",
          children: [
            "/AspNetCore/Authorization/Sample.md",
             "/reference/config.md"],
        },
      ],
      "/WPF/": [
        {
          text: "项目中的一些玩法",
          children: ["20220608_DynamicListView"],
        },
      ],
      "/Linux": [
        "/Linux/DualNetworkConfiguration.md"
      ],
      "/Java/Maven": [
        "/Java/Maven/Install.md"
      ],
      "/Java/SpringBoot":[
        "/Java/SpringBoot/Index.md",
        "/Java/SpringBoot/HelloWorld.md",
        "/Java/SpringBoot/Simplified.md"

      ]
    },
  }),
});

