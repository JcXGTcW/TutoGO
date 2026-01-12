# BOTRUN 波特人知識問答技能

這是一個 Claude Code Skill，用於回答關於 BOTRUN 波特人（生成式 AI bot 平台）的專業問題。

## 功能特色

此技能提供以下五個核心問答能力：

1. **BOTRUN 波特人是什麼？**
   - 介紹波特人的定義與開發公司

2. **BOTRUN 波特人有哪些主要功能？**
   - 說明知識庫建立、多角色專業分工、數據整合等功能

3. **BOTRUN 波特人的核心特色是什麼？**
   - 介紹融合地端、領域介面、自動波特等三大特色
   - 說明六層技術架構

4. **BOTRUN 波特人如何確保資料安全？**
   - 解釋封閉式地端、專屬雲端等安全措施

5. **BOTRUN 波特人有哪些應用案例？**
   - 提供數據分析、政府應用、環保應變等實際案例

## 使用方式

此技能會在以下情況自動啟用：
- 當使用者詢問關於 BOTRUN 波特人的問題時
- 當需要了解波特人的功能、特色、安全性或應用案例時

## 引證來源

所有回答都基於以下可靠來源，並提供完整的引證資訊：

### 主要來源網站
- [BOTRUN 波特人官方網站](https://intro.botrun.ai/)
- [卡米爾公司 BOTRUN 介紹](https://cameo.tw/tw/botrun-ai/index.html)
- [BOTRUN 常見問答](https://intro.botrun.ai/faqs.html)
- [BOTRUN 成功案例](https://intro.botrun.ai/solution-list.html)
- [BOTRUN 技術文章 (Medium)](https://medium.com/@bohachu/)

### 引證原則
1. 所有引證文字使用引號標示
2. 完整引用原文，不竄改內容
3. 提供完整的來源網址
4. 每個回答至少包含一個引證來源

## 技能架構

```
.claude/skills/porter-qa-skill/
├── SKILL.md          # 技能主檔案（包含 YAML frontmatter 和問答知識庫）
└── README.md         # 本說明文件
```

## 開發資訊

- **技能名稱**: porter-qa-skill
- **開發日期**: 2026-01-12
- **版本**: 1.0.0
- **語言**: 繁體中文
- **Claude Code 兼容性**: ✓

## 相關連結

- [Claude Code Skills 官方文件](https://code.claude.com/docs/ja/skills)
- [如何創建自訂 Skills](https://support.claude.com/en/articles/12512198-how-to-create-custom-skills)
- [GitHub - Anthropic Skills Repository](https://github.com/anthropics/skills)

## 授權說明

本技能中的所有引證內容版權歸原始來源所有。本技能僅作為資訊彙整與問答輔助工具。
