const translations={
'.nav nav>a':'Collection', '#open-letter':'Send a wish <span>↗</span>',
'#hero-title':'The castle<br>of <em>memories.</em>', '.hero-copy>.eyebrow':'<span></span> WELCOME TO MY LITTLE WORLD',
'.hero-copy>p':'Some moments deserve to stay forever.<br>And some wishes make them even brighter.',
'.hero-actions>a':'Enter the castle <span>↗</span>', '.signature>span':'Kept with love by',
'.scene-note>span:last-child':'DRAG TO EXPLORE<small>Every wish, a little star.</small>',
'.hero-bottom>a':'SCROLL INTO MEMORIES <span>↓</span>', '.section-top h2':'One photograph.<br><em>One story.</em>',
'.section-top>p':'Choose a photograph you love.<br>Leave a wish, leave a little warmth.', '#grid-view':'Photo grid', '#orbit-view':'3D gallery',
'#empty h3':'These frames are waiting for their stories.', '#empty p':'The album is empty. You can still leave a wish for Đức.',
'#empty-letter':'Write a wish ↗', '.collection-footer>span:first-child':'Little moments. Lasting memories.',
'.invitation h2':'Leave a little <em>warmth.</em>', '.invitation p':'A wish, a question, or just a hello.<br>I will read and treasure every note you send.',
'#bottom-letter':'Write to Đức <span>↗</span>', 'footer>span':'A PLACE FOR EVERYTHING WORTH REMEMBERING.', 'footer>a:last-child':'Back to the top ↑',
'.letter-body h2':'A little note <em>for me.</em>', 'label[for=sender]':'Your name', 'label[for=message]':'Your wish',
'label[for=question]':'Do you have a question for me?', '.privacy':'Your name and note are sent privately to Đức and are not displayed publicly.',
'.libra-constellation>span':'♎ LIBRA <small>THE SCALES</small>'
};
const messages={
loading:['Đang mở bộ sưu tập…','Opening the collection…'], count:['khoảnh khắc được lưu giữ','moments to remember'],
loadError:['Chưa tải được album','Unable to load the album'],albumError:['Album tạm thời chưa tải được. Vui lòng tải lại trang sau ít phút.','The album could not load. Please refresh the page in a few minutes.'],
imageError:['Ảnh tạm thời không tải được','This image could not load.'],general:['Gửi đến lâu đài của Đức',"To Đức’s castle"],
draft:['Hộp thư chưa được kết nối. Bạn có thể viết trước; bản nháp được giữ trong trình duyệt này.','The mailbox is not connected yet. You can write now; your draft is saved in this browser.'],
pause:['Tạm dừng chuyển động','Pause motion'],resume:['Bật chuyển động','Resume motion'],send:['Gửi lời nhắn','Send your note'],sending:['Đang gửi…','Sending…'],
received:['Đã nhận được lời nhắn của bạn. Cảm ơn bạn đã để lại một vì sao!','Your note was received. Thank you for leaving a little star!'],
failed:['Chưa gửi được. Bản nháp vẫn được giữ, bạn có thể thử lại.','Unable to send. Your draft is saved; please try again.'],required:['Vui lòng nhập tên và lời chúc.','Please enter your name and a wish.'],
unconnected:['Hộp thư chưa được kết nối với Google Sheets. Lời nhắn chưa được gửi; bản nháp đã lưu trên thiết bị này.','The mailbox is not connected to Google Sheets. Your note was not sent; the draft is saved on this device.'],
timeout:['Chưa nhận được xác nhận. Bạn có thể thử lại; hệ thống giữ mã gửi để tránh ghi trùng.','No confirmation received. You can retry; the same request ID prevents duplicate notes.'],
transferring:['Đang chuyển lời nhắn đến Đức…','Sending your note to Đức…'],question:['Nếu gửi mình một điều ước, bạn sẽ ước điều gì?','If you could send me one wish, what would it be?'],
report:['ảnh chưa mở được · Xem chi tiết','images could not load · View details'],musicOn:['Bật nhạc nền','Play background music'],musicOff:['Tắt nhạc nền','Mute background music'],musicError:['Chưa bật được nhạc. Vui lòng thử lại.','Unable to start music. Please try again.']
};
let lang='vi';try{lang=localStorage.getItem('vietduc-language')==='en'?'en':'vi'}catch{}
export const language=()=>lang;
export const t=key=>messages[key]?.[lang==='en'?1:0]||key;
export const photoTitle=p=>lang==='en'?p.title.replace(/^Kỷ niệm (\d+)$/,'Memory $1'):p.title;
const originals=new Map();
export function applyLanguage(value){lang=value==='en'?'en':'vi';document.documentElement.lang=lang;try{localStorage.setItem('vietduc-language',lang)}catch{}
for(const [selector,en]of Object.entries(translations)){const el=document.querySelector(selector);if(!el)continue;if(!originals.has(selector))originals.set(selector,el.innerHTML);el.innerHTML=lang==='en'?en:originals.get(selector);}
const attrs=[['#sender','placeholder','Mình nên gọi bạn là…','What should I call you…'],['#message','placeholder','Viết những điều bạn muốn gửi đến mình…','Write something you would like to tell me…'],['#answer','placeholder','Câu trả lời của bạn (không bắt buộc)','Your answer (optional)'],['#question','placeholder','Một điều bạn tò mò… (không bắt buộc)','Something you are curious about… (optional)'],['#close-letter','aria-label','Đóng','Close'],['#tour','aria-label','Xoay một vòng lâu đài','Take a castle tour'],['.filters','aria-label','Kiểu hiển thị','Gallery view'],['.nav nav','aria-label','Điều hướng','Navigation'],['#scene','aria-label','Lâu đài 3D trên đảo nổi; kéo để xoay, cuộn để phóng to','3D castle on a floating island; drag to rotate, scroll to zoom'],['.libra-constellation','aria-label','Chòm sao Thiên Bình, minh họa cách điệu','Libra constellation, artistic illustration']];
for(const [selector,attr,vi,en]of attrs)document.querySelector(selector)?.setAttribute(attr,lang==='en'?en:vi);
document.body.dataset.language=lang;document.querySelector('#language').value=lang;
document.title=lang==='en'?'The Castle of Memories • Việt Đức':'Lâu đài của những hồi ức • Việt Đức';
document.querySelector('meta[property="og:title"]').content=document.title;
document.querySelector('meta[name="description"]').content=lang==='en'?"A little castle for Nguyễn Việt Đức’s memories. Choose a photograph and leave a wish.":'Lâu đài của những hồi ức của Nguyễn Việt Đức. Chọn một bức ảnh và để lại lời chúc.';
}
