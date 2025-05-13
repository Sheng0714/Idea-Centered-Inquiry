import { ToggleButtonGroup, ToggleButton, Paper } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import AccountTreeIcon from '@mui/icons-material/AccountTree';

export const ChatModeToggle = ({ isMapBoard, updateBoardMode }) => {
  const handleChange = (event, newValue) => {
    console.log(newValue)
    if (newValue !== null) {
      updateBoardMode(newValue);
    }
  };

  return (
    <Paper 
      variant="outlined"
      sx={{ 
        p: 1,
        backgroundColor: '#ECF2FF',
        borderRadius: 10
      }}
    >
      <ToggleButtonGroup
        value={isMapBoard}
        exclusive
        onChange={handleChange}
        aria-label="視圖模式切換"
        sx={{
          '& .MuiToggleButton-root': {
            border: 'none',
            borderRadius: 10,
            padding: '8px 16px',
            margin: '0 4px',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              backgroundColor: 'rgba(25, 118, 210, 0.08)'
            },
            '&.Mui-selected': {
              backgroundColor: '#505A5B',
              color: 'white',
              '&:hover': {
                backgroundColor: '#343F3E'
              }
            }
          }
        }}
      >
        <ToggleButton value={false}>
          <ChatIcon sx={{ mr: 1 }} />
          聊天室
        </ToggleButton>
        <ToggleButton value={true}>
          <AccountTreeIcon sx={{ mr: 1 }} />
          心智圖
        </ToggleButton>
      </ToggleButtonGroup>
    </Paper>
  );
};

export default ChatModeToggle;