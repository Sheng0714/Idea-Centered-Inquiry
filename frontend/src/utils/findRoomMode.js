export const findroomByInfo = (activityInfo) => {
  console.log("getActivityInfo", activityInfo);
  if(activityInfo.data.settings.chatmode === 'chatroom'){
      return "/forum/modes/chatroom";
  }
  if(activityInfo.data.settings.chatmode === 'posts'){
    return "/forum/modes/posts";
}
  return "/forum";
};


