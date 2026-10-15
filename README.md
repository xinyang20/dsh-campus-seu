# DSH Campus · SEU

[![CI](https://github.com/xinyang20/dsh-campus-seu/actions/workflows/ci.yml/badge.svg)](https://github.com/xinyang20/dsh-campus-seu/actions/workflows/ci.yml)
[![Code license: MIT](https://img.shields.io/badge/code-MIT-green.svg)](LICENSE)
[![DSH 0.2.0-rc.2](https://img.shields.io/badge/DSH-0.2.0--rc.2-blue.svg)](https://github.com/deepseek-ai/deepseek-harness)

把东南大学的校园绿、校训、建筑与叮东带进 DSH Web。

一个独立维护的单校校园主题插件，支持九龙湖与四牌楼两种风景，跟随宿主浅色、深色和系统外观。与东南大学及 DeepSeek 官方无隶属或背书关系。

![浅色主题，开启可选叮东](https://raw.githubusercontent.com/xinyang20/dsh-campus-seu/main/docs/screenshots/v0.3/light-mascot.jpg)

截图开启了可选叮东，安装后的默认值为关闭。截图中的摄影与角色素材说明见 [素材来源](ATTRIBUTION.md)。

## 功能

- **校园氛围**：校园绿与金色点缀、完整校徽、「止于至善」校训、1902 侧栏铭牌，连同宿主菜单一起适配。
- **两种校区风景**：九龙湖李文正图书馆、四牌楼大礼堂；缩略图下拉列表支持键盘导航。
- **可选叮东**：内置透明背景的挥手重建形象，独立开关；支持替换为自己的本地图片，随时恢复内置形象。
- **按需显示**：主题、欢迎卡、校训和叮东均可开关；关闭主题恢复宿主外观。
- **集中设置**：仅使用「设置 → 校园主题(SEU)」入口，位于内置设置项下方。素材来源和署名统一收纳在设置中。
- **响应式布局**：适配浅色、深色、窄窗口、矮窗口及主栏宽度变化，保留宿主输入框与会话交互。

<details>
<summary>查看深色、窄窗口和设置效果</summary>

![深色主题](https://raw.githubusercontent.com/xinyang20/dsh-campus-seu/main/docs/screenshots/v0.3/dark-mascot.jpg)

<img src="https://raw.githubusercontent.com/xinyang20/dsh-campus-seu/main/docs/screenshots/v0.3/dark-narrow.jpg" alt="窄窗口深色主题" width="390">

![主题设置](https://raw.githubusercontent.com/xinyang20/dsh-campus-seu/main/docs/screenshots/v0.3/settings-mascot.jpg)

</details>

## 安装

兼容 **DSH Web `0.2.0-rc.2`**。CLI/TUI 不适用。先确认 `dsh --version`，并将下面的 `YOUR_PROFILE` 替换为你正在使用的 Web profile 名称。

推荐从 [Releases](https://github.com/xinyang20/dsh-campus-seu/releases) 安装预构建包，无需在用户机器编译：

```sh
dsh plugin --profile YOUR_PROFILE add https://github.com/xinyang20/dsh-campus-seu/releases/download/v0.3.0/dsh-campus-seu-0.3.0.tgz --ignore-scripts
```

安装后重新启动该 profile 的 DSH Web 并刷新浏览器，在「设置 → 校园主题(SEU)」中调整。校园主题默认启用，叮东默认关闭。

也可下载 Release 的 `.tgz` 后安装本地文件：

```sh
dsh plugin --profile YOUR_PROFILE add ./dsh-campus-seu-0.3.0.tgz --ignore-scripts
```

卸载后同样重新启动 DSH Web：

```sh
dsh plugin --profile YOUR_PROFILE remove dsh-campus-seu
```

## 使用与数据

所有设置即时生效。偏好仅保存在当前浏览器的 `dsh-campus-seu.preferences.v1` 中，并在同源标签页间同步；不改写 DSH 自身的外观偏好，不修改对话数据。

自选叮东图片支持 PNG、JPEG、WebP，最大 512 KiB，在当前浏览器中保存，不上传。「恢复内置形象」仅清除自选图片，保留叮东显示开关；「恢复主题默认设置」会清除本插件的偏好，恢复主题启用、九龙湖欢迎卡和校训，关闭叮东。

## 本地开发

需要 Node.js `^22.19.0 || >=24.0.0` 和 pnpm `10.33.2`。依赖与宿主版本由锁文件固定。

```sh
git clone https://github.com/xinyang20/dsh-campus-seu.git
cd dsh-campus-seu
pnpm install --frozen-lockfile --ignore-scripts
pnpm run check
pnpm run dev
```

`dev` 在本目录 `.runtime/dsh-home` 中创建隔离的 Web profile，默认仅监听 `127.0.0.1:39395`。打开终端输出的本地认证地址即可预览。它不复制现有账号、模型密钥或用户 DSH 配置。

仓库提交预构建的 `lib/client.js`，修改源码后请运行 `pnpm run check` 并同步提交构建产物。CI 会检查构建、自动测试、已提交产物一致性和打包。

生成分发包：

```sh
pnpm run check
pnpm pack --pack-destination .runtime/dist
```

分发包只包含插件入口、客户端产物、素材、补丁和必要说明，不含开发实例、认证配置、缓存、截图或用户自选图片。保留 `private: true` 以防意外发布 npm；不影响 GitHub 与 tarball 安装。

## 兼容性与验证

本版本基于 DSH Web `0.2.0-rc.2` 的主题 API 与插槽。欢迎卡扩展了 `conversation.hero.brand.mark` 品牌插槽的布局；升级宿主后需重新检查外观。其他插件同时占用该插槽或覆盖相同颜色时，显示受优先级与覆盖顺序影响。

当前自动测试涵盖设置持久化、输入校验、素材路由边界及外观清理生命周期。真实 DSH 中的浅色、深色、窄窗口和设置交互记录见 [界面验证记录](https://github.com/xinyang20/dsh-campus-seu/blob/main/docs/VALIDATION.md)。这些检查不包含模型回答质量或所有第三方插件组合。

## 开源与素材

**插件代码采用 [MIT License](LICENSE)。图片和品牌素材使用各自的许可或权利说明。** 两张建筑照片分别采用 CC BY-SA 4.0、CC BY-SA 3.0；校徽及叮东角色不因代码开源获得额外授权。内置叮东是 AI 重建形象，不是官方标准图。

完整范围见 [NOTICE.md](NOTICE.md)、[素材来源与署名](ATTRIBUTION.md) 和 [叮东生成记录](docs/dingdong-generation.md)。界面截图中出现的素材同样适用这些说明。

仓库使用 `dsh` 和官方约定的 `dsh-plugin` topics。打包遵循 [DSH 插件发布文档](https://deepseek-harness.github.io/deepseek-harness/develop/basic/publish)，发现规则见 [DSH README](https://github.com/deepseek-ai/deepseek-harness#community-and-support)。
