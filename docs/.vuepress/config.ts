import { defaultTheme } from '@vuepress/theme-default'
import { defineUserConfig } from 'vuepress/cli'
import { viteBundler } from '@vuepress/bundler-vite'

export default defineUserConfig({
  bundler: viteBundler(),
  port: 4624,
  lang: "zh-CN",
  title: "吴俊城",
  description: "知识的总结",
  theme: defaultTheme({
    // 在这里进行配置
    repoLabel: "我的博客",
    repo: "https://cnblogs.com/wujuncheng",
    sidebarDepth: 2,
    navbar: [
      // NavbarItem
      { text: "Git", link: "/Tools/GitQuickStart.md" },
      // {
      //   text: ".NET",
      //   children: [

      //   ]
      // },
      {
        text: "C#",
        link: "/CSharp/",
      },
      {
        text: "F#",
        link: "/FSharp/QuickStart",
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
      {
        text: "后端生态",
        // link:"/Backend/"
        children: [
          {
            text: "Redis",
            link: "/Backend/Redis/Install.md",
          },
          {
            text: "Docker",
            link: "/Backend/Docker/Install.md",
          },
          {
            text: "Kubernetes",
            link: "/Backend/Kubernetes/QuickStart.md",
          },
        ],
      },
      {
        text: "生态项目",
        children: [
          {
            text: "日志",
            children: [
              // {
              //   text:"NLog的基本使用"
              // },
              {
                text: "NLog的配置文件",
                link: "/Ecosystem/NLog/NLogConfigurationFile.md",
              },
            ],
          },
        ],
      },
      {
        text: "Linux",
        link: "/Linux/",
      },
      {
        text: "基础设施",
        link: "/Infrastructure/",
      },
      {
        text: "前端篇",
        children: [
          {
            text: "Vue",
            children: [
              {
                text: "Vue基础",
                link: "/Vue/VueSingleFileComponents.md",
              },
            ],
          },
        ],
      },
      {
        text: "VS Code的插件与玩法",
        link: "vscode",
      },
      {
        text: "Rust",
        link: "/Rust/variables.md",
      },
      {
        text: "Python",
        link: "/Python/Scope.md",
      },
      {
        text: "Java篇",
        children: [
          {
            text: "Maven",
            link: "/Java/Maven/Install.md",
          },
          {
            text: "Spring Boot",
            link: "/Java/SpringBoot/",
          },
        ],
      },
      {
        text: "实际项目",
        link:"/Projects/index.md"
      }
      // 字符串 - 页面文件路径
      // '/bar/README.md',
    ],
    sidebar: {
      "/CSharp": [
        {
          text: "编程在干什么",
          link: "/CSharp/description",
        },
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
        {
          text: "经验分享",
          children: [
            "/CSharp/ExperienceSharing/StringDisplayWidth",
            "/CSharp/ExperienceSharing/UseRecursionSparingly",
          ],
        },
      ],
      "/AspNetCore/": [
        {
          text: "基础部分",
          children: ["/AspNetCore/Basic/Startup.md"],
        },
        {
          text: "鉴权授权",
          children: [
            "/AspNetCore/Authorization/AuthenticationAndAuthorization.md",
            "/AspNetCore/Authorization/HelloAuthentication.md",
            "/AspNetCore/Authorization/Sample.md",
            "/reference/config.md",
          ],
        },
        {
          text: "好库推荐",
          children: ["/AspNetCore/TripartiteLibrary/Polly.md"],
        },
      ],
      "/WPF/": [
        {
          text: "项目中的一些玩法",
          children: ["20220608_DynamicListView"],
        },
      ],
      "/Ecosystem/": [
        {
          text: "Nlog",
          children: [
            "/Ecosystem/NLog/Install.md",
            "/Ecosystem/NLog/NLogConfigurationFile.md",
            "/Ecosystem/NLog/WriteInDatabase.md",
          ],
        },
      ],
      "/Backend/Docker/": [
        "/Backend/Docker/Install.md",
        "/Backend/Docker/QuickStart.md"
      ],
      "/Linux": [
        "/Linux/Debian12Init.md",
        "/Linux/DualNetworkConfiguration.md"
      ],
      "/Infrastructure/Nginx": [
        "/Infrastructure/Nginx/NginxProxyLocalServer.md",
      ],
      "/Vue/": [
        "/Vue/VueSingleFileComponents.md",
        "/Vue/VueApiStyle.md",
        "/Vue/VueTemplate.md",
      ],
      "/Rust": [
        "/Rust/variables.md",
        "/Rust/DataTypes.md",
        "/Rust/ControlFlow.md",
      ],
      "/Java/Maven": ["/Java/Maven/Install.md"],
      "/Java/SpringBoot": [
        "/Java/SpringBoot/Index.md",
        "/Java/SpringBoot/HelloWorld.md",
        "/Java/SpringBoot/Simplified.md",
      ],
    },
  }),
});
