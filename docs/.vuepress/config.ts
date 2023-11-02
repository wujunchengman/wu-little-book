import { defaultTheme, defineUserConfig } from "vuepress";
import { SidebarConfig } from "vuepress";

export default defineUserConfig({
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
      {
        text: "后端生态",
        // link:"/Backend/"
        children: [
          {
            text: "Docker",
            link: "/Backend/Docker/QuickStart.md",
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
        link: "/Linux",
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
      "/Linux": ["/Linux/DualNetworkConfiguration.md"],
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
