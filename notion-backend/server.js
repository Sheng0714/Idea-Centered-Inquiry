
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





// const express = require('express');
// const { Client } = require('@notionhq/client');
// const cors = require('cors');

// const app = express();
// app.use(express.json());

// // 配置 CORS
// app.use(cors({
//   origin: 'http://localhost',
//   methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   credentials: true,
// }));

// app.options('*', cors());

// // 初始化 Notion 客戶端
// const notion = new Client({ auth: process.env.NOTION_API_KEY });
// const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;

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

// // 根據學生姓名、班級名稱和主題名稱從 Notion 資料庫中獲取議論文內容
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

// // 新增端點：根據班級名稱查詢 Notion 資料庫中的記錄
// app.get('/api/get-students-by-class/:className', async (req, res) => {
//   const { className } = req.params;

//   if (!className) {
//     return res.status(400).json({
//       success: false,
//       error: '缺少必要參數：className 為必填項',
//     });
//   }

//   try {
//     const response = await notion.databases.query({
//       database_id: NOTION_DATABASE_ID,
//       filter: {
//         property: '班級',
//         rich_text: {
//           equals: className,
//         },
//       },
//     });

//     // 映射查詢結果，提取主題、學生姓名和繳交日期
//     const students = response.results.map((page) => ({
//       theme: page.properties['主題']?.rich_text?.[0]?.text?.content || '未知主題',
//       studentName: page.properties['學生姓名']?.title?.[0]?.plain_text || '未知學生',
//       submissionDate: page.created_time || '尚未繳交', // 使用 Notion 頁面的創建時間作為繳交日期
//     }));

//     res.json({
//       success: true,
//       data: students,
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




// const express = require('express');
// const { Client } = require('@notionhq/client');
// const cors = require('cors');

// const app = express();
// app.use(express.json());

// // 配置 CORS
// app.use(cors({
//   origin: 'http://localhost',
//   methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   credentials: true,
// }));

// app.options('*', cors());

// // 初始化 Notion 客戶端
// const notion = new Client({ auth: process.env.NOTION_API_KEY });
// const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;

// // 處理提交到 Notion 的端點（包括筆記區內容）
// app.post('/api/submit-to-notion', async (req, res) => {
//   console.log('收到請求:', req.body);

//   const { studentName, theme, essayContent, className, noteContent } = req.body;

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
//         '筆記區': {
//           rich_text: [
//             {
//               text: {
//                 content: noteContent || '', // 如果沒有筆記內容，設置為空字串
//               },
//             },
//           ],
//         },
//       },
//     });
//     console.log('Notion API 回應:', response);
//     res.json({ success: true, data: response });
//   } catch (error) {
//     console.error('Notion API 錯誤詳情:', error);
//     console.error('錯誤堆棧:', error.stack);
//     res.status(500).json({
//       success: false,
//       error: error.message || '無法提交到 Notion，請檢查伺服器日誌',
//     });
//   }
// });

// // 根據學生姓名、班級名稱和主題名稱從 Notion 資料庫中獲取議論文內容
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

//     const essayContent = response.results[0].properties['議論文內容'].rich_text[0]?.text.content || '';
//     const noteContent = response.results[0].properties['筆記區'].rich_text[0]?.text.content || '';
//     res.json({
//       success: true,
//       data: { essayContent, noteContent },
//     });
//   } catch (error) {
//     console.error('Notion API 錯誤詳情:', error);
//     res.status(500).json({
//       success: false,
//       error: error.message || '無法從 Notion 獲取資料，請檢查伺服器日誌',
//     });
//   }
// });

// // 新增端點：根據學生姓名、班級和主題更新筆記區內容
// app.patch('/api/update-note', async (req, res) => {
//   const { studentName, className, theme, noteContent } = req.body;

//   if (!studentName || !className || !theme || noteContent === undefined) {
//     return res.status(400).json({
//       success: false,
//       error: '缺少必要字段：studentName, className, theme 和 noteContent 為必填項',
//     });
//   }

//   try {
//     // 查詢符合條件的記錄
//     const queryResponse = await notion.databases.query({
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

//     if (queryResponse.results.length === 0) {
//       return res.status(404).json({
//         success: false,
//         error: '未找到符合學生姓名、班級和主題的記錄',
//       });
//     }

//     // 取得第一筆匹配記錄的 page_id
//     const pageId = queryResponse.results[0].id;

//     // 更新筆記區內容
//     const updateResponse = await notion.pages.update({
//       page_id: pageId,
//       properties: {
//         '筆記區': {
//           rich_text: [
//             {
//               text: {
//                 content: noteContent,
//               },
//             },
//           ],
//         },
//       },
//     });

//     console.log('Notion API 更新回應:', updateResponse);
//     res.json({ success: true, data: updateResponse });
//   } catch (error) {
//     console.error('Notion API 錯誤詳情:', error);
//     res.status(500).json({
//       success: false,
//       error: error.message || '無法更新 Notion 筆記區內容，請檢查伺服器日誌',
//     });
//   }
// });

// // 根據班級名稱查詢 Notion 資料庫中的記錄
// app.get('/api/get-students-by-class/:className', async (req, res) => {
//   const { className } = req.params;

//   if (!className) {
//     return res.status(400).json({
//       success: false,
//       error: '缺少必要參數：className 為必填項',
//     });
//   }

//   try {
//     const response = await notion.databases.query({
//       database_id: NOTION_DATABASE_ID,
//       filter: {
//         property: '班級',
//         rich_text: {
//           equals: className,
//         },
//       },
//     });

//     const students = response.results.map((page) => ({
//       theme: page.properties['主題']?.rich_text?.[0]?.text?.content || '未知主題',
//       studentName: page.properties['學生姓名']?.title?.[0]?.plain_text || '未知學生',
//       submissionDate: page.created_time || '尚未繳交',
//     }));

//     res.json({
//       success: true,
//       data: students,
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
  origin: 'http://localhost',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.options('*', cors());

// 初始化 Notion 客戶端
const notion = new Client({ auth: process.env.NOTION_API_KEY });
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;

// 處理提交到 Notion 的端點（包括筆記區內容）
app.post('/api/submit-to-notion', async (req, res) => {
  console.log('收到請求:', req.body);

  const { studentName, theme, essayContent, className, noteContent } = req.body;

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
        '筆記區': {
          rich_text: [
            {
              text: {
                content: noteContent || '', // 如果沒有筆記內容，設置為空字串
              },
            },
          ],
        },
      },
    });
    console.log('Notion API 回應:', response);
    res.json({ success: true, data: response });
  } catch (error) {
    console.error('Notion API 錯誤詳情:', error);
    console.error('錯誤堆棧:', error.stack);
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

    const essayContent = response.results[0].properties['議論文內容'].rich_text[0]?.text.content || '';
    const noteContent = response.results[0].properties['筆記區'].rich_text[0]?.text.content || '';
    res.json({
      success: true,
      data: { essayContent, noteContent },
    });
  } catch (error) {
    console.error('Notion API 錯誤詳情:', error);
    res.status(500).json({
      success: false,
      error: error.message || '無法從 Notion 獲取資料，請檢查伺服器日誌',
    });
  }
});

// 更新或創建記錄：根據學生姓名、班級和主題更新筆記區和議論文內容
app.patch('/api/update-note', async (req, res) => {
  const { studentName, className, theme, noteContent, essayContent } = req.body;

  if (!studentName || !className || !theme || noteContent === undefined || essayContent === undefined) {
    return res.status(400).json({
      success: false,
      error: '缺少必要字段：studentName, className, theme, noteContent 和 essayContent 為必填項',
    });
  }

  try {
    // 查詢符合條件的記錄
    const queryResponse = await notion.databases.query({
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

    if (queryResponse.results.length > 0) {
      // 如果記錄存在，更新該記錄
      const pageId = queryResponse.results[0].id;

      const updateResponse = await notion.pages.update({
        page_id: pageId,
        properties: {
          '筆記區': {
            rich_text: [
              {
                text: {
                  content: noteContent,
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
        },
      });

      console.log('Notion API 更新回應:', updateResponse);
      res.json({ success: true, data: updateResponse });
    } else {
      // 如果記錄不存在，創建新記錄
      const createResponse = await notion.pages.create({
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
          '筆記區': {
            rich_text: [
              {
                text: {
                  content: noteContent,
                },
              },
            ],
          },
        },
      });

      console.log('Notion API 創建回應:', createResponse);
      res.json({ success: true, data: createResponse });
    }
  } catch (error) {
    console.error('Notion API 錯誤詳情:', error);
    res.status(500).json({
      success: false,
      error: error.message || '無法更新或創建 Notion 記錄，請檢查伺服器日誌',
    });
  }
});

// 根據班級名稱查詢 Notion 資料庫中的記錄
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

    const students = response.results.map((page) => ({
      theme: page.properties['主題']?.rich_text?.[0]?.text?.content || '未知主題',
      studentName: page.properties['學生姓名']?.title?.[0]?.plain_text || '未知學生',
      submissionDate: page.created_time || '尚未繳交',
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