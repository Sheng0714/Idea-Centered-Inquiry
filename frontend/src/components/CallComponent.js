import React, { useState } from 'react';

const CallComponent = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    console.log('clicked');
    setIsOpen(true);
  };

  return (
    <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000, backgroundColor: 'white', borderRadius: '2%',padding: '20px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
      {isOpen ? (
        <div>            
            <button
                onClick={()=>{setIsOpen(false)}}
                style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                backgroundColor: '#ff5f5f',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '30px',
                height: '30px',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
                }}
            >
                ✖
            </button>
            <iframe
            src="https://ragflow.lazyinwork.com/chat/share?shared_id=8737e8febea411efa0180242ac130005&from=agent&auth=NiMzdlZWYwYmViMzExZWZhYWJhMDI0Mm"
            style={{ width: '100%', height: '100%', minHeight: '600px' }}
            />
        </div>
      ) : (
        <div
          onClick={handleClick}
          style={{
            width: '10px',
            height: '10px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
            backgroundColor: '#f0f0f0',
            borderRadius: '50%',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
          }}
        >
          📞
        </div>
      )}
    </div>
  );
};

export default CallComponent;
