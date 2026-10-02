// Paste into the Apps Script project BOUND to your own Google Sheet.
// Script Properties: SPREADSHEET_ID = ID between /d/ and /edit in your Sheet URL.
// SITE_ORIGIN = https://duckxyz06.github.io (or your own HTTPS domain).
function doPost(e) {
 const props=PropertiesService.getScriptProperties();
 const origin=props.getProperty('SITE_ORIGIN');
 const p=(e&&e.parameter)||{};
 let result={type:'vietduc-wish-result',id:String(p.id||''),ok:false,message:'Chưa thể lưu lời nhắn.'};
 try {
  if(!origin||!/^https:\/\/[a-z0-9.-]+(:\d+)?$/i.test(origin))throw Error('Chủ trang chưa cấu hình SITE_ORIGIN.');
  if(!/^[a-f0-9-]{36}$/i.test(p.id||''))throw Error('Mã gửi không hợp lệ.');
  if(p.website)throw Error('Lời nhắn không hợp lệ.');
  const limits={sender:80,email:254,message:2000,answer:1000,question:500,photoId:500,photoTitle:500,prompt:500};
  Object.keys(limits).forEach(k=>{p[k]=String(p[k]||'').trim();if(p[k].length>limits[k])throw Error('Nội dung vượt giới hạn.');});
  if(p.email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email))throw Error('Email không hợp lệ.');
  if(!p.sender||!p.message)throw Error('Vui lòng nhập tên và lời chúc.');
  const sheetId=props.getProperty('SPREADSHEET_ID');if(!sheetId)throw Error('Chủ trang chưa cấu hình Google Sheet.');
  const lock=LockService.getScriptLock();lock.waitLock(15000);
  try {
   const book=SpreadsheetApp.openById(sheetId);const sheet=book.getSheetByName('LoiChuc')||book.insertSheet('LoiChuc');
   if(sheet.getLastRow()===0){sheet.appendRow(['Thời gian','Mã gửi','Tên người gửi','Mã ảnh','Tên ảnh','Lời chúc','Câu hỏi của chủ trang','Câu trả lời','Câu hỏi của khách','Email (không bắt buộc)']);sheet.setFrozenRows(1);}
   else sheet.getRange(1,10).setValue('Email (không bắt buộc)');
   const rows=sheet.getLastRow();const duplicate=rows>1&&sheet.getRange(2,2,rows-1,1).createTextFinder(p.id).matchEntireCell(true).findNext();
   if(!duplicate){const safe=v=>/^[=+\-@\t\r]/.test(v)?"'"+v:v;sheet.appendRow([new Date(),p.id,...['sender','photoId','photoTitle','message','prompt','answer','question','email'].map(k=>safe(p[k]))]);}
   formatWishTable_(sheet);SpreadsheetApp.flush();
   result.ok=true;result.message='Đã lưu lời nhắn.';
  }finally{lock.releaseLock();}
 }catch(err){console.error(err);result.message=String(err.message||'Chưa thể lưu lời nhắn.');}
 // HTML Service runs inside a Google iframe. postMessage sends a confirmed receipt
 // to the hosting top-level site without relying on opaque no-cors responses.
 const json=JSON.stringify(result).replace(/</g,'\\u003c');
 const target=JSON.stringify(origin||'https://duckxyz06.github.io').replace(/</g,'\\u003c');
 return HtmlService.createHtmlOutput('<!doctype html><html><body><p>Đã xử lý lời nhắn.</p><script>window.top.postMessage('+json+','+target+');</script></body></html>').setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
function doGet(){return ContentService.createTextOutput(JSON.stringify({service:'VietDuc wishes',ready:!!PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID')})).setMimeType(ContentService.MimeType.JSON);}

// Format only the ten columns of the wishes table, including its header.
function formatWishTable_(sheet) {
 const rows=sheet.getLastRow();
 if(rows===0)return;
 sheet.getRange(1,1,rows,10)
  .setFontFamily('Times New Roman')
  .setFontSize(14)
  .setHorizontalAlignment('center')
  .setVerticalAlignment('middle')
  .setBorder(true,true,true,true,true,true);
}

// Run once from Apps Script to apply the same formatting to existing wishes.
function formatWishesSheet() {
 const sheetId=PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
 if(!sheetId)throw Error('Chủ trang chưa cấu hình Google Sheet.');
 const lock=LockService.getScriptLock();lock.waitLock(15000);
 try {
  const sheet=SpreadsheetApp.openById(sheetId).getSheetByName('LoiChuc');
  if(!sheet)throw Error('Chưa có bảng LoiChuc để định dạng.');
  formatWishTable_(sheet);
  SpreadsheetApp.flush();
 }finally{lock.releaseLock();}
}
