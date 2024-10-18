---
title: 字符串的显示宽度
---

# 判断字符串的显示宽度

## 起因：

公司有一个使用项目使用HTML转换为PDF，其中有一个表格，表格的最后一列中的单元格，其字符串超长后会被丢弃，而不是换行到下一行展示（HtmlToPdf渲染引擎导致的，没办法更改）

## 解决方案：

根据字符串长度手动添加`<br/>`换行

```csharp
var source = "ABCD";

if (GetLength(source)>2)
{
    source = source.Insert(2,"<br/>");
}

Console.WriteLine(source);
// 输出AB<br/>CD

int GetLength(string src)
{
    return src.Length;
}
```

## 出现了一个BUG：

当原始内容中存在中文时，中文字符的显示宽度大于英文字符的宽度，按照字符串中的字符数进行处理，并不准确

```csharp
/*
* 中文：中文<br/>CD
* 英文：AB<br/>CD
*/
```

## 原因分析：

在文字的显示中，有全角和半角的区别

全角：指一个字符占用两个标准字符位置的状态。

半角：指一个字符占用一个标准字符位置的状态。

## 尝试解决：

字符编码：最早的字符编码为Ascii码，只考虑了英文语种使用者，后来随着计算机的普及，有了其他编码，比如GB2312、UTF8等，不止包含英文的字符编码，但是这些编码都对Ascii码进行了兼容

没有细心求证的结论：Ascii码对应的是半角，中文扩展部分是全角展示，半角显示宽度为全角的一半（这结论是我猜的，没有求证，如果不对还请提出批评指正）

通过上面猜测的结论，可以先对每个字符判断是不是Ascii字符来决定当前是全角还是半角

```csharp

var source = "ABCD";
var index =InserAtDisplayWidth(2,source);
if (index!=-1)
{
    source = source.Insert(index,"<br/>");
}
// AB<br/>CD
Console.WriteLine(source);

var source2 = "中文CD"; 
var index2 =InserAtDisplayWidth(2,source2);
if (index2!=-1)
{
    source2 = source2.Insert(index2,"<br/>");
}
// 中<br/>文CD
Console.WriteLine(source2);



int InserAtDisplayWidth(int inserAtDisplayWidth, string source){
    int now =0;
    for (int i = 0; i < source.Length; i++)
    {
        if( char.IsAscii(source[i])){
            // 半角占一个显示宽度
            now +=1;
        }else{
            // 全角占两个显示宽度
            now +=2;
        };

        if (now>inserAtDisplayWidth)
        {
            return i;
        }
    }
    return -1;
}
```
通过对字符的判断，更加准确的匹配了分隔的位置，既避免了无效的空白区域，又避免了过长的字符串溢出导致看不到内容

```csharp
/*
* AB<br/>CD
* 中<br/>文CD
*/
```