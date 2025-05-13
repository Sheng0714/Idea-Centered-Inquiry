import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Checkbox, TextField, Select, MenuItem, Button, Grid, Typography, Box } from '@mui/material';

const ActivitySettingsDialog = ({
  open,
  onClose,
  roomSetting,
  setRoomSetting,
  saveSettings,
  getIconByLabel
}) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.5rem' }}>活動室設定</DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          

          {/* 基本設定 */}
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ marginBottom: 1 }}>
              基本設定：
            </Typography>
            <TextField
              id="intro"
              label="活動說明"
              multiline
              rows={6}
              variant="outlined"
              fullWidth
              defaultValue={
                roomSetting?.intro || '關於這個活動的資訊，可以填在這邊'
              }
              onChange={(e) =>
                setRoomSetting({ ...roomSetting, intro: e.target.value })
              }
            />
          </Grid>

          {/* 活動室模式選擇 */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{ marginBottom: 1 }}>
              切換活動室模式：
            </Typography>
            <Select
              id="chatmode"
              value={roomSetting?.chatmode || 'mindmap'}
              onChange={(e) =>
                setRoomSetting({ ...roomSetting, chatmode: e.target.value })
              }
              variant="outlined"
              fullWidth
            >
              <MenuItem value="mindmap">Mind Map</MenuItem>
              <MenuItem value="posts">Posts</MenuItem>
              <MenuItem value="chatroom">Chatroom</MenuItem>
            </Select>
          </Grid>

          {/* 模式圖示 */}
          <Grid item xs={12} md={6}>
            <Box sx={{ textAlign: 'center' }}>
              <img
                style={{ width: '50%' }}
                alt="活動室圖示"
                src={getIconByLabel(roomSetting?.chatmode || 'mindmap')}
              />
            </Box>
          </Grid>

          {/* 實驗功能 */}
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ marginBottom: 1 }}>
            實驗功能
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Checkbox
              checked={roomSetting?.helper_system || false}
              onChange={(e) =>
                setRoomSetting({ ...roomSetting, helper_system: e.target.checked })
              }
              inputProps={{ 'aria-label': 'controlled' }}
            /> 通用論證助理系統
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined" color="secondary">
          取消
        </Button>
        <Button
          onClick={async () => {
            await saveSettings(roomSetting);
            onClose();
          }}
          variant="contained"
          color="primary"
        >
          確認
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ActivitySettingsDialog;
