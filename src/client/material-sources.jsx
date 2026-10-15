import React from 'react';
import { CAMPUSES } from './campus-data.js';

function Link({ href, children }) {
  return <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>;
}

export function MaterialSources() {
  return <details className="dsh-seu-sources">
    <summary>素材与署名</summary>
    <p>校园照片、学校标识和叮东形象的来源集中列在这里。此主题由独立开发者制作。</p>
    {Object.entries(CAMPUSES).map(([id, campus]) => <section key={id}>
      <h3>{campus.name} · {campus.landmark}</h3>
      <p><Link href={campus.source}>Wikimedia Commons 原作品</Link> · <Link href={campus.authorUrl}>{campus.author}</Link>摄，{campus.year} 年 · <Link href={campus.licenseUrl}>{campus.license}</Link>。</p>
      <p>原始照片 {campus.width} × {campus.height}，文件未改写。欢迎卡与缩略图按容器适配裁切；开启叮东时会叠加角色图层。</p>
    </section>)}
    <section><h3>校徽、校名、校训与配色</h3>
      <p>完整校徽来自<Link href="https://www.seu.edu.cn/p47316c47313/list.psp">东南大学官网</Link>，保持原色和完整比例。校名与<Link href="https://history.seu.edu.cn/18738/list.htm">「止于至善」校训</Link>使用系统字体排写；校园绿与黄色参考<Link href="https://www.seu.edu.cn/scgf/list.htm">学校色彩规范</Link>，界面颜色另作明暗适配。</p>
    </section>
    <section><h3>叮东 · 主题重建形象</h3>
      <p>参照现有<Link href="https://kknews.cc/zh-sg/education/25znl59.html">2020 年叮东全身形象转载图</Link>，使用 AI 重建为透明背景的挥手单体。角色发布线索见<Link href="https://m.thepaper.cn/baijiahao_8352219">东南大学官方发布介绍</Link>。</p>
      <p>保留橙红松鼠、白色脸腹、深蓝上衣和大尾巴；重建图并非官方标准图稿。自选图片仅存于当前浏览器，不上传。</p>
    </section>
    <p>摄影许可仅适用于对应照片。校徽、学校品牌及叮东角色的权利仍归各自权利人；本地主题展示与 AI 重建不代表官方授权，也不赋予额外再分发权。</p>
  </details>;
}
