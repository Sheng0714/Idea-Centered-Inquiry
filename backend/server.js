
// const express = require('express');
// const { Client } = require('@notionhq/client');
// const cors = require('cors');

// const app = express();
// app.use(express.json());

// // 配置 CORS
// app.use(cors({
//   origin: 'http://localhost', // 明確指定前端來源
//   methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   credentials: true,
// }));

// app.options('*', cors());

// // 初始化 Notion 客戶端
// const notion = new Client({ auth: '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' });
// const NOTION_DATABASE_ID = '1e0f62c3743f802aa3add604507ef1e7';

// // 處理提交到 Notion 的端點
// app.post('/api/submit-to-notion', async (req, res) => {
//   console.log('收到請求:', req.body); // 記錄前端發送的數據

//   const { studentName, theme, essayContent, className } = req.body;

//   // 驗證請求數據
//   if (!studentName || !theme || !essayContent || !className) {
//     return res.status(400).json({
//       success: false,
//       error: '缺少必要字段：studentName, theme, essayContent 和 className 為必填項',
//     });
//   }

//   try {
//     const response = await notion.pages.create({
//       parent: { database_id: NOTION_DATABASE_ID },
//       properties: {
//         '學生姓名': {
//           title: [
//             {
//               text: {
//                 content: studentName,
//               },
//             },
//           ],
//         },
//         '班級': {
//           rich_text: [
//             {
//               text: {
//                 content: className,
//               },
//             },
//           ],
//         },
//         '主題': {
//           rich_text: [
//             {
//               text: {
//                 content: theme,
//               },
//             },
//           ],
//         },
//         '議論文內容': {
//           rich_text: [
//             {
//               text: {
//                 content: essayContent,
//               },
//             },
//           ],
//         },
//       },
//     });
//     console.log('Notion API 回應:', response); // 記錄 Notion API 回應
//     res.json({ success: true, data: response });
//   } catch (error) {
//     console.error('Notion API 錯誤詳情:', error); // 記錄詳細錯誤
//     console.error('錯誤堆棧:', error.stack); // 記錄錯誤堆棧
//     res.status(500).json({
//       success: false,
//       error: error.message || '無法提交到 Notion，請檢查伺服器日誌',
//     });
//   }
// });

// const PORT = 4000;
// app.listen(PORT, () => {
//   console.log(`伺服器運行在 http://localhost:${PORT}`);
// });











// const express = require('express');
// const { Client } = require('@notionhq/client');
// const cors = require('cors');

// const app = express();
// app.use(express.json());

// // 配置 CORS
// app.use(cors({
//   origin: 'http://localhost', // 明確指定前端來源
//   methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   credentials: true,
// }));

// app.options('*', cors());

// // 初始化 Notion 客戶端
// const notion = new Client({ auth: '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' });
// const NOTION_DATABASE_ID = '1e0f62c3743f802aa3add604507ef1e7';

// // 處理提交到 Notion 的端點
// app.post('/api/submit-to-notion', async (req, res) => {
//   console.log('收到請求:', req.body); // 記錄前端發送的數據

//   const { studentName, theme, essayContent, className } = req.body;

//   // 驗證請求數據
//   if (!studentName || !theme || !essayContent || !className) {
//     return res.status(400).json({
//       success: false,
//       error: '缺少必要字段：studentName, theme, essayContent 和 className 為必填項',
//     });
//   }

//   try {
//     const response = await notion.pages.create({
//       parent: { database_id: NOTION_DATABASE_ID },
//       properties: {
//         '學生姓名': {
//           title: [
//             {
//               text: {
//                 content: studentName,
//               },
//             },
//           ],
//         },
//         '主題': {
//           rich_text: [
//             {
//               text: {
//                 content: theme,
//               },
//             },
//           ],
//         },
//         '議論文內容': {
//           rich_text: [
//             {
//               text: {
//                 content: essayContent,
//               },
//             },
//           ],
//         },
//         '班級': {
//           rich_text: [
//             {
//               text: {
//                 content: className,
//               },
//             },
//           ],
//         },
//       },
//     });
//     console.log('Notion API 回應:', response); // 記錄 Notion API 回應
//     res.json({ success: true, data: response });
//   } catch (error) {
//     console.error('Notion API 錯誤詳情:', error); // 記錄詳細錯誤
//     console.error('錯誤堆棧:', error.stack); // 記錄錯誤堆棧
//     res.status(500).json({
//       success: false,
//       error: error.message || '無法提交到 Notion，請檢查伺服器日誌',
//     });
//   }
// });

// // 新增端點：根據學生姓名、班級名稱和主題名稱從 Notion 資料庫中獲取議論文內容
// app.get('/api/get-essay/:studentName', async (req, res) => {
//   const { studentName } = req.params;
//   const { className, theme } = req.query;

//   if (!studentName || !className || !theme) {
//     return res.status(400).json({
//       success: false,
//       error: '缺少必要參數：studentName, className 和 theme 為必填項',
//     });
//   }

//   try {
//     const response = await notion.databases.query({
//       database_id: NOTION_DATABASE_ID,
//       filter: {
//         and: [
//           {
//             property: '學生姓名',
//             title: {
//               equals: studentName,
//             },
//           },
//           {
//             property: '班級',
//             rich_text: {
//               equals: className,
//             },
//           },
//           {
//             property: '主題',
//             rich_text: {
//               equals: theme,
//             },
//           },
//         ],
//       },
//     });

//     if (response.results.length === 0) {
//       return res.status(404).json({
//         success: false,
//         error: '未找到符合學生姓名、班級和主題的議論文內容',
//       });
//     }

//     // 假設每個學生在特定班級和主題最多只有一篇議論文，取第一筆資料
//     const essayContent = response.results[0].properties['議論文內容'].rich_text[0]?.text.content || '';
//     res.json({
//       success: true,
//       data: { essayContent },
//     });
//   } catch (error) {
//     console.error('Notion API 錯誤詳情:', error);
//     res.status(500).json({
//       success: false,
//       error: error.message || '無法從 Notion 獲取資料，請檢查伺服器日誌',
//     });
//   }
// });

// const PORT = 4000;
// app.listen(PORT, () => {
//   console.log(`伺服器運行在 http://localhost:${PORT}`);
// });





const express = require('express');
const { Client } = require('@notionhq/client');
const cors = require('cors');

const app = express();
app.use(express.json());

// 配置 CORS
app.use(cors({
  origin: 'http://localhost', // 明確指定前端來源
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.options('*', cors());

// 初始化 Notion 客戶端
const notion = new Client({ auth: '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' });
const NOTION_DATABASE_ID = '1e0f62c3743f802aa3add604507ef1e7';

// 處理提交到 Notion 的端點
app.post('/api/submit-to-notion', async (req, res) => {
  console.log('收到請求:', req.body); // 記錄前端發送的數據

  const { studentName, theme, essayContent, className } = req.body;

  // 驗證請求數據
  if (!studentName || !theme || !essayContent || !className) {
    return res.status(400).json({
      success: false,
      error: '缺少必要字段：studentName, theme, essayContent 和 className 為必填項',
    });
  }

  try {
    const response = await notion.pages.create({
      parent: { database_id: NOTION_DATABASE_ID },
      properties: {
        '學生姓名': {
          title: [
            {
              text: {
                content: studentName,
              },
            },
          ],
        },
        '主題': {
          rich_text: [
            {
              text: {
                content: theme,
              },
            },
          ],
        },
        '議論文內容': {
          rich_text: [
            {
              text: {
                content: essayContent,
              },
            },
          ],
        },
        '班級': {
          rich_text: [
            {
              text: {
                content: className,
              },
            },
          ],
        },
      },
    });
    console.log('Notion API 回應:', response); // 記錄 Notion API 回應
    res.json({ success: true, data: response });
  } catch (error) {
    console.error('Notion API 錯誤詳情:', error); // 記錄詳細錯誤
    console.error('錯誤堆棧:', error.stack); // 記錄錯誤堆棧
    res.status(500).json({
      success: false,
      error: error.message || '無法提交到 Notion，請檢查伺服器日誌',
    });
  }
});

// 根據學生姓名、班級名稱和主題名稱從 Notion 資料庫中獲取議論文內容
app.get('/api/get-essay/:studentName', async (req, res) => {
  const { studentName } = req.params;
  const { className, theme } = req.query;

  if (!studentName || !className || !theme) {
    return res.status(400).json({
      success: false,
      error: '缺少必要參數：studentName, className 和 theme 為必填項',
    });
  }

  try {
    const response = await notion.databases.query({
      database_id: NOTION_DATABASE_ID,
      filter: {
        and: [
          {
            property: '學生姓名',
            title: {
              equals: studentName,
            },
          },
          {
            property: '班級',
            rich_text: {
              equals: className,
            },
          },
          {
            property: '主題',
            rich_text: {
              equals: theme,
            },
          },
        ],
      },
    });

    if (response.results.length === 0) {
      return res.status(404).json({
        success: false,
        error: '未找到符合學生姓名、班級和主題的議論文內容',
      });
    }

    // 假設每個學生在特定班級和主題最多只有一篇議論文，取第一筆資料
    const essayContent = response.results[0].properties['議論文內容'].rich_text[0]?.text.content || '';
    res.json({
      success: true,
      data: { essayContent },
    });
  } catch (error) {
    console.error('Notion API 錯誤詳情:', error);
    res.status(500).json({
      success: false,
      error: error.message || '無法從 Notion 獲取資料，請檢查伺服器日誌',
    });
  }
});

// 新增端點：根據班級名稱查詢 Notion 資料庫中的記錄
app.get('/api/get-students-by-class/:className', async (req, res) => {
  const { className } = req.params;

  if (!className) {
    return res.status(400).json({
      success: false,
      error: '缺少必要參數：className 為必填項',
    });
  }

  try {
    const response = await notion.databases.query({
      database_id: NOTION_DATABASE_ID,
      filter: {
        property: '班級',
        rich_text: {
          equals: className,
        },
      },
    });

    // 映射查詢結果，提取主題、學生姓名和繳交日期
    const students = response.results.map((page) => ({
      theme: page.properties['主題']?.rich_text?.[0]?.text?.content || '未知主題',
      studentName: page.properties['學生姓名']?.title?.[0]?.plain_text || '未知學生',
      submissionDate: page.created_time || '尚未繳交', // 使用 Notion 頁面的創建時間作為繳交日期
    }));

    res.json({
      success: true,
      data: students,
    });
  } catch (error) {
    console.error('Notion API 錯誤詳情:', error);
    res.status(500).json({
      success: false,
      error: error.message || '無法從 Notion 獲取資料，請檢查伺服器日誌',
    });
  }
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`伺服器運行在 http://localhost:${PORT}`);
});