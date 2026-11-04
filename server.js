import express from 'express';
import { fetch, ProxyAgent } from 'undici';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root = path.dirname(fileURLToPath(import.meta.url));
export function createApp({key=process.env.OPENAI_API_KEY, model=process.env.OPENAI_MODEL || 'gpt-4.1-mini', request=fetch}={}) {
 const dispatcher=process.env.HTTPS_PROXY?new ProxyAgent(process.env.HTTPS_PROXY):undefined;
 const app=express(); app.use(express.json({limit:'32kb'}));
 app.get('/api/status',(_,res)=>res.json({connected:!!key,model:key?model:null}));
 let active=0;
 app.post('/api/task',async(req,res)=>{
  const prompt=req.body?.prompt;
  if(typeof prompt!=='string'||!prompt.trim()||prompt.length>8000) return res.status(400).json({error:'Nhập nhiệm vụ từ 1 đến 8.000 ký tự.'});
  if(!key) return res.status(503).json({error:'Chưa cấu hình OPENAI_API_KEY trên máy chủ. Bạn có thể dùng chế độ demo.'});
  if(active>=2) return res.status(429).json({error:'Văn phòng đang bận. Vui lòng thử lại sau.'});
  active++;
  try {
   const response=await request('https://api.openai.com/v1/responses',{method:'POST',headers:{Authorization:`Bearer ${key}`,'Content-Type':'application/json'},body:JSON.stringify({model,instructions:'Bạn là trợ lý trong Viet Office. Trả lời bằng tiếng Việt, rõ ràng, hữu ích. Bạn chỉ có thể trả lời văn bản, không có công cụ đọc/sửa tệp hay chạy lệnh. Không nói đã thực hiện thao tác mà bạn không thể thực hiện.',input:prompt,max_output_tokens:1800}),signal:AbortSignal.timeout(60000),...(dispatcher?{dispatcher}:{})});
   if(!response.ok) return res.status(502).json({error:`OpenAI chưa xử lý được yêu cầu (HTTP ${response.status}). Kiểm tra key, model và hạn mức trên máy chủ.`});
   const data=await response.json();
   const answer=(data.output||[]).flatMap(x=>x.content||[]).filter(x=>x.type==='output_text').map(x=>x.text).join('\n');
   if(!answer) return res.status(502).json({error:'OpenAI không trả về nội dung văn bản. Hãy thử lại.'});
   res.json({answer});
  } catch {res.status(502).json({error:'Không kết nối được OpenAI hoặc yêu cầu đã hết thời gian. Vui lòng thử lại.'});}
  finally{active--;}
 });
 app.use((err,req,res,next)=>res.status(err.status||500).json({error:'Yêu cầu không hợp lệ.'}));
 return app;
}
if(process.argv[1]===fileURLToPath(import.meta.url)){
 const app=createApp();
 if(process.env.NODE_ENV==='production') app.use(express.static(path.join(root,'dist')));
 else {const {createServer}=await import('vite'); const vite=await createServer({root,server:{middlewareMode:true},appType:'spa'});app.use(vite.middlewares);}
 app.listen(Number(process.env.PORT)||4310,'127.0.0.1',()=>console.log('Viet Office đang chạy trên cổng '+(process.env.PORT||4310)));
}
