import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider } from '@mui/material';

// 使用 import 导入图片
import step1Image from '../assets/td1.png';
import step2Image from '../assets/td2.png';
import step3Image from '../assets/td3.png';
import step4Image from '../assets/td4.png';
import step5Image from '../assets/td5.png';
import step6Image from '../assets/td6.png';
import step7Image from '../assets/td7.png';
import step8Image from '../assets/td8.png';

export const TutorialDialog = ({ open, onClose }) => {
    const [page, setPage] = useState(0);

    const handleNext = () => {
        setPage((prevPage) => prevPage + 1);
    };

    const handleBack = () => {
        setPage((prevPage) => prevPage - 1);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md">
            <DialogTitle>
                <h4 style={{ textAlign: 'center' }}>圖表說明</h4>


            </DialogTitle>
            <Divider variant="middle" />
            <DialogContent>
                <div style={{ width: '600px', height: '400px', textAlign: 'center' }}>
                    {page === 0 && (
                        <div>
                            <p>累計節點時間圖可以看到每位學生在討論時的節點累計變化</p>
                            <img src={step1Image} alt="Step 1" style={{ width: '100%', height: 'auto', maxWidth: '600px', maxHeight: '400px' }} />
                        </div>
                    )}
                    {page === 1 && (
                        <div>
                            <p>查看指定時間下學生想法累計數</p>
                            <img src={step2Image} alt="Step 2" style={{ width: '100%', height: 'auto', maxWidth: '600px', maxHeight: '400px' }} />
                        </div>
                    )}
                    {page === 2 && (
                        <div>
                            <p>鷹架數量圖可以了解學生使用鷹架的分布情形</p>
                            <img src={step3Image} alt="Step 3" style={{ width: '100%', height: 'auto', maxWidth: '600px', maxHeight: '400px' }} />
                        </div>
                    )}
                    {page === 3 && (
                        <div>
                            <p>累計標籤圖為整個小組的總計數</p>
                            <img src={step4Image} alt="Step 4" style={{ width: '100%', height: 'auto', maxWidth: '600px', maxHeight: '400px' }} />
                        </div>
                    )}
                    {page === 4 && (
                        <div>
                            <p>個人標籤圖展示了學生標籤的使用次數</p>
                            <img src={step5Image} alt="Step 5" style={{ width: '100%', height: 'auto', maxWidth: '600px', maxHeight: '400px' }} />
                        </div>
                    )}
                    {page === 5 && (
                        <div>
                            <p>查看學生特定標籤的使用次數</p>
                            <img src={step6Image} alt="Step 6" style={{ width: '100%', height: 'auto', maxWidth: '600px', maxHeight: '400px' }} />
                        </div>
                    )}
                    {page === 6 && (
                        <div>
                            <p>留言串直覺的呈現了全部的討論內容，可透過展開了解詳細內容</p>
                            <img src={step7Image} alt="Step 7" style={{ width: '100%', height: 'auto', maxWidth: '600px', maxHeight: '400px' }} />
                        </div>
                    )}
                    {page === 7 && (
                        <div>
                            <p>收起查看其他想法</p>
                            <img src={step8Image} alt="Step 8" style={{ width: '100%', height: 'auto', maxWidth: '600px', maxHeight: '400px' }} />
                        </div>
                    )}
                    
                </div>
                
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} style={{ color: 'green', marginRight: 'auto' }}>關閉說明</Button>
                {page > 0 && <Button onClick={handleBack}>上一頁</Button>}
                {page < 7 && <Button onClick={handleNext}>下一頁</Button>}
            </DialogActions>
        </Dialog>
    );
};
