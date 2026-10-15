# 叮东主题重建记录

日期：2026-10-15。

- 生成方式：内置 imagegen 工具，透明背景模式。
- 最终文件：[assets/dingdong-rebuilt.png](../assets/dingdong-rebuilt.png)，1247 × 1261，RGBA PNG。
- 参考：已收集的 `docs/campus-theme/schools/seu/reference/reprints/dingdong-fullbody-2020.jpg`，原始线索见 [2020 年发布介绍转载](https://kknews.cc/zh-sg/education/25znl59.html)及 [东南大学官方介绍](https://m.thepaper.cn/baijiahao_8352219)。
- 制作：以原有叮东外观为参考重建单个挥手姿态，保留橙红松鼠、白脸腹、深蓝上衣与大尾巴，未加入文字或校徽。生成文件原样复制，未使用脚本裁切、抠图或重绘；网页使用等比例缩放与 CSS 投影。
- 此图是主题重建形象，不是官方标准图稿或新的授权证明。角色来源与使用边界统一列在插件设置的「素材与署名」中，完整记录见 [ATTRIBUTION.md](../ATTRIBUTION.md)。

## 最终采用的生成提示词

```text
Use case: stylized-concept. Asset type: transparent PNG mascot illustration for a Southeast University campus-themed desktop app. The attached reference sheet shows the mascot Dingdong. Use it as the character reference, not as a background or composition to copy. Rebuild ONE clean standalone full-body Dingdong character: friendly orange-red squirrel with a large upward-curving bushy tail, cream-white muzzle/cheeks and belly, small red tuft, upright rounded ears, large dark brown expressive eyes, little black nose, cheerful gentle smile, navy-blue short-sleeved polo shirt. Three-quarter front pose, standing with both feet visible and one hand waving in greeting. Preserve the recognizable visual character from the reference. A polished flat 2D vector-like illustration with smooth organic shapes, restrained subtle shading, crisp silhouette and simplified details that read clearly at 100–160 CSS pixels. No text, no school seal or emblem, no lettering on the shirt, no banner, no props, no ground plane, no scenery, no frame, no watermark, no duplicate figures or character sheet. The character should fill roughly 90% of the image height with safe transparent padding and the tail entirely inside the image. Use genuine alpha transparency for the whole background, no white rectangle, no checkerboard pattern painted into the image. Final image intended to look clean on both dark forest green and warm paper backgrounds.
```
