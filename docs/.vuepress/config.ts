import { defineUserConfig } from 'vuepress'

export default defineUserConfig({
  lang: 'zh-CN',
  title: '吴俊城',
  description: '知识的总结',
})

const { defaultTheme } = require('@vuepress/theme-default')

module.exports = {
  theme: defaultTheme({
    // 在这里进行配置
    base: '',
    repoLabel: '我的博客',
    repo: 'https://cnblogs.com/wujuncheng',
    navbar: [
        // NavbarItem
        {
          text: 'C#',
          link: '/',
        },
        {
            text: 'AspNetCore',
            link: '/AspNetCore/',
          },
          {
            text: 'EntityFrameworkCore',
            link: '/EntityFrameworkCore',
          },
          {
            text: 'WPF',
            link: '/WPF/',
          },
        // NavbarGroup
        {
          text: '生态项目',
          children: ['/group/foo.md', '/group/bar.md'],
        },
        // 字符串 - 页面文件路径
        // '/bar/README.md',
      ],
      sidebar: {
          '/': [
            {
                text: '前言',
                link: '/introduction'
                // collapsable: false,
                // children: [
                //   '/introduction',
                // ]
              },
              {
                text: '基础语法',
                link: '/introduction',
                // collapsable: false,
                children: [
                  '/introduction',
                  '/introduction',
                  '/introduction',
                  '/introduction',
                ]
              },
          ],
          '/AspNetCore/':[
            {
                text: 'Reference',
                children: ['/reference/cli.md', '/reference/config.md'],
              },
          ],
          '/WPF/':[
            {
                text: '项目中的一些玩法',
                children: ['20220608_DynamicListView'],
              },
          ]
      }
      
  }),
}