import * as T from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';

export function createOffice(container, onEvent) {
 const scene=new T.Scene();scene.background=new T.Color('#dce5df');scene.fog=new T.Fog('#dce5df',40,85);
 const camera=new T.PerspectiveCamera(36,1,.1,120);const overview=new T.Vector3(19,21,23);camera.position.copy(overview);
 const renderer=new T.WebGLRenderer({antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,1.8));renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.25;container.prepend(renderer.domElement);
 const controls=new OrbitControls(camera,renderer.domElement);controls.target.set(0,0,0);controls.enableDamping=true;controls.minDistance=5;controls.maxDistance=42;controls.maxPolarAngle=Math.PI/2.3;controls.minPolarAngle=.25;
 scene.add(new T.HemisphereLight('#fff9e8','#71887a',2.3));const sun=new T.DirectionalLight('#ffedcd',3.5);sun.position.set(5,18,7);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-15,right:15,top:13,bottom:-13});sun.shadow.bias=-.0005;scene.add(sun);
 const materials=new Map();const mat=c=>{if(!materials.has(c))materials.set(c,new T.MeshStandardMaterial({color:c,roughness:.75}));return materials.get(c);};
 const C={wood:'#b88c63',cream:'#eee9d8',dark:'#253e39',green:'#63856a',terra:'#c47d5d',metal:'#526560'};
 const box=(w,h,d,c,x,y,z,parent=scene)=>{const o=new T.Mesh(new T.BoxGeometry(w,h,d),typeof c==='string'?mat(c):c);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;};
 const ball=(r,c,x,y,z,parent=scene)=>{const o=new T.Mesh(new T.SphereGeometry(r,12,10),mat(c));o.position.set(x,y,z);o.castShadow=true;parent.add(o);return o;};
 function cylinder(r1,r2,h,c,x,y,z,parent=scene){const o=new T.Mesh(new T.CylinderGeometry(r1,r2,h,20),mat(c));o.position.set(x,y,z);o.castShadow=true;parent.add(o);return o;}
 const clickables=[];
 function textLabel(text,x,y,z,{color='#536c59',bg='#f9f6e9',size=1.8}={}){
  const canvas=document.createElement('canvas');canvas.width=512;canvas.height=128;const ctx=canvas.getContext('2d');ctx.fillStyle=bg;ctx.fillRect(0,0,512,128);ctx.fillStyle=color;ctx.font='600 38px system-ui';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,256,64);const texture=new T.CanvasTexture(canvas);texture.colorSpace=T.SRGBColorSpace;const sprite=new T.Sprite(new T.SpriteMaterial({map:texture,depthTest:false}));sprite.scale.set(size,size/4,1);sprite.position.set(x,y,z);scene.add(sprite);return sprite;
 }
 // Whole floor, cutaway walls and a broad central corridor.
 box(19,.45,14,'#b5bfae',0,-.3,0);box(18.8,.1,13.8,C.cream,0,-.025,0);
 box(18.8,2.7,.16,'#b9cbbd',0,1.3,-6.9);box(.16,2.7,13.8,'#cbd6c6',-9.4,1.3,0);
 for(let x=-9;x<9;x+=.65)box(.014,.009,13.7,'#ded7c3',x,.035,0);
 box(18.5,.012,1.6,'#ddd7c8',0,.045,1.2);
 // Rear partitions leave openings onto the corridor; low glass keeps the room legible.
 const glass=new T.MeshPhysicalMaterial({color:'#b0d2cf',transparent:true,opacity:.22,roughness:.15,depthWrite:false});
 for(const x of [-4,3.5]){box(.1,.7,6.4,'#a7b8a8',x,.35,-3.55);box(.055,1.3,6.4,glass,x,1.35,-3.55);for(const z of [-6.7,-3.6,-.4])box(.08,2,.08,C.metal,x,1,z);box(.08,.06,6.4,C.metal,x,2,-3.55);}
 // Windows and city silhouettes behind the floor.
 for(const x of [-7,-1,6.6]){box(3.6,1.7,.06,'#bad9d3',x,1.65,-6.79);for(const dx of [-1.8,0,1.8])box(.075,1.8,.1,C.cream,x+dx,1.65,-6.7);box(3.7,.07,.1,C.cream,x,1.65,-6.7);}
 for(let i=0;i<14;i++){const h=1.7+(Math.sin(i*7)+1)*1.9;box(.9,h,.7,'#b2c6c2',-10+i*1.5,h/2-1,-10-Math.cos(i)*1.2);}
 box(80,.15,80,'#ccd8cc',0,-.65,0);
 // Department rugs.
 box(4.6,.025,4.8,'#d9c7a5',-6.7,.06,-3.5);box(6.5,.025,4.7,'#b0c5ad',-.3,.06,-3.4);box(4.4,.025,4.7,'#bdcbd3',6.4,.06,-3.4);box(6.5,.025,3.9,'#cfb99d',-5.5,.06,4.4);box(5.3,.025,3.8,'#b2c2b4',5.8,.06,4.4);
 textLabel('THƯ VIỆN',-6.7,2.7,-5.8);textLabel('STUDIO SÁNG TẠO',-.2,2.7,-5.8,{size:2.9});textLabel('PHÒNG MÁY',6.4,2.7,-5.8);textLabel('PHÒNG HỌP',-5.6,.6,6.2);textLabel('COFFEE & CHILL',6,.6,6.2,{size:2.3});
 // Bookshelves.
 for(const x of [-8.4,-6.6,-4.8]){box(1.55,2.1,.5,C.wood,x,1.05,-6.1);for(const y of [.18,.75,1.32,1.9]){box(1.5,.08,.58,C.cream,x,y,-6.02);if(y<1.9)for(let i=0;i<8;i++)box(.13,.34+(i%3)*.05,.3,['#66806c','#c18d63','#e3d6af','#718f9c'][i%4],x-.61+i*.17,y+.23,-5.98);}}
 cylinder(.75,.75,.1,C.wood,-7.1,.78,-3.4);cylinder(.09,.12,.75,C.dark,-7.1,.38,-3.4);box(.6,.07,.42,C.cream,-7.1,.87,-3.4);
 function chair(x,z,color=C.green,angle=0){const g=new T.Group();scene.add(g);g.position.set(x,0,z);g.rotation.y=angle;box(.6,.13,.62,color,0,.55,0,g);box(.6,.65,.12,color,0,.94,.3,g);cylinder(.06,.06,.5,C.metal,0,.25,0,g);for(const a of [0,Math.PI/2]){const foot=box(.75,.06,.08,C.dark,0,.08,0,g);foot.rotation.y=a;}return g;}
 function desk(x,z){box(2.25,.12,1.1,C.wood,x,.97,z);for(const dx of [-.95,.95])for(const dz of [-.4,.4])box(.075,.92,.075,C.metal,x+dx,.46,z+dz);box(.95,.6,.08,C.dark,x,1.39,z-.26);box(.84,.48,.012,'#82baae',x,1.41,z-.211);box(.07,.19,.08,C.dark,x,1.09,z-.26);box(.65,.03,.24,C.cream,x,1.05,z+.23);for(let i=0;i<4;i++)box(.35,.018,.012,'#bde1d2',x-.12,1.5-i*.075,z-.2);cylinder(.08,.07,.16,C.terra,x+.82,1.09,z+.1);chair(x,z+1.05);}
 desk(-1.9,-4.4);desk(1.25,-4.4);desk(-1.9,-1.8);desk(1.25,-1.8);
 // Server racks, pulsing status lights, a diagnostic station.
 const leds=[];for(const x of [5.1,6.5,7.9]){box(1.05,2.15,.8,C.dark,x,1.08,-5.65);for(let row=0;row<7;row++){box(.88,.2,.03,'#435a59',x,.27+row*.27,-5.23);for(let j=0;j<4;j++)box(.1,.025,.02,'#253b3c',x-.25+j*.16,.27+row*.27,-5.2);leds.push(box(.045,.045,.025,'#91d7ab',x+.32,.27+row*.27,-5.2));}}
 box(2.6,.13,.85,C.cream,6.5,1,-2.8);for(const x of [5.5,7.5])box(.08,.95,.6,C.metal,x,.48,-2.8);box(1.25,.72,.1,C.dark,6.5,1.5,-2.96);box(1.1,.57,.02,'#70a8b3',6.5,1.5,-2.9);
 // Meeting area with a ringable bell and a planning board.
 box(3.4,.14,1.6,C.wood,-5.8,.94,3.9);for(const x of [-6.9,-4.7])box(.1,.9,1.1,C.metal,x,.45,3.9);for(const x of [-6.7,-5.1]){chair(x,2.6,C.green,Math.PI);chair(x,5.25,C.green);}box(1.2,.035,.7,C.cream,-6,.042+1.02,3.9);box(.6,.05,.4,'#92afa5',-5.1,1.05,3.7);
 const bell=cylinder(.15,.22,.18,'#d5ac56',-6.8,1.1,3.8);bell.userData.action='bell';clickables.push(bell);
 box(.1,2.4,2.5,C.wood,-8.8,1.3,3.8);box(.11,1.6,2.15,'#f5f1df',-8.73,1.6,3.8);for(let i=0;i<6;i++)box(.015,.2,.26,['#d7b47e','#b6c7a8','#a4bfbd'][i%3],-8.66,1.2+(i%3)*.38,3.35+Math.floor(i/3)*.7);
 // Pantry, sofa, small tables and lamp.
 box(4.7,.92,.65,C.wood,6.1,.46,2.6);box(4.85,.09,.8,C.cream,6.1,.97,2.6);for(const x of [4.1,5.3,6.5,7.7])box(.025,.65,.02,'#9b714e',x,.48,3);
 box(.52,.62,.42,C.dark,7.6,1.3,2.6);box(.35,.22,.04,'#b7c6b7',7.6,1.38,2.83);cylinder(.1,.08,.17,C.cream,7.6,1.08,2.92);
 box(2.7,.42,.85,'#cda685',5.8,.42,5);box(2.7,.7,.2,'#bd9476',5.8,.85,5.4);for(const x of [4.4,7.2])box(.22,.6,1.05,C.wood,x,.6,5);for(const x of [5.15,6.4])box(1.1,.12,.72,'#dfbd98',x,.69,4.96);
 cylinder(.65,.65,.08,C.wood,5.8,.55,3.9);cylinder(.09,.12,.5,C.dark,5.8,.25,3.9);cylinder(.1,.08,.18,C.cream,5.65,.68,3.9);
 const lampLight=new T.PointLight('#ffcb80',6,6);lampLight.position.set(8.3,2.3,5.4);scene.add(lampLight);cylinder(.05,.05,2.1,C.dark,8.3,1.05,5.4);const shade=cylinder(.38,.55,.45,'#e8c98c',8.3,2.2,5.4);shade.userData.action='lamp';clickables.push(shade);
 // Plants and entry mat.
 function plant(x,z,s=1){const g=new T.Group();g.position.set(x,0,z);g.scale.setScalar(s);scene.add(g);cylinder(.26,.19,.48,C.terra,0,.24,0,g);box(.06,.8,.06,C.green,0,.8,0,g);for(let i=0;i<7;i++){const leaf=ball(.25,i%2?'#5a8164':'#799770',Math.sin(i*2)*.22,.75+i*.085,Math.cos(i*2)*.2,g);leaf.scale.set(.6,1.4,.6);leaf.rotation.z=Math.sin(i)*.7;}}
 for(const [x,z,s] of [[-8.7,-.1,1.2],[-3.6,-6.3,1.1],[3.8,-6.2,1.1],[8.7,-.5,1.2],[-8.8,6.1,1.1],[8.7,6.2,1.2],[2.4,5.5,.9]])plant(x,z,s);
 box(2.7,.025,1.1,'#657c65',.2,.06,6);textLabel('VIET OFFICE',.2,.45,6.7,{size:2.6});
 // Characters are visual teammates in this demo, not separate AI sessions.
 function teammate(name,color,x,z){const root=new T.Group();root.position.set(x,0,z);scene.add(root);box(.44,.56,.28,color,0,1.02,0,root);const head=new T.Group();head.position.y=1.52;root.add(head);ball(.23,'#dcb28f',0,0,0,head);ball(.235,'#343b32',0,.1,.04,head);for(const dx of [-.08,.08])ball(.023,'#28352e',dx,.01,-.215,head);const arms=[],legs=[];for(const side of [-1,1]){const arm=new T.Group();arm.position.set(side*.3,1.22,0);root.add(arm);box(.13,.4,.14,color,0,-.18,0,arm);ball(.075,'#dcb28f',0,-.41,0,arm);arms.push(arm);const leg=new T.Group();leg.position.set(side*.13,.76,0);root.add(leg);box(.16,.5,.17,'#344741',0,-.25,0,leg);box(.18,.12,.3,'#26342f',0,-.53,-.06,leg);legs.push(leg);}
 const label=textLabel(name,x,2.1,z,{size:1.05});return {name,root,label,arms,legs,target:new T.Vector3(x,0,z),queue:[],walking:false,talkingUntil:0,home:new T.Vector3(x,0,z)};}
 const minh=teammate('Minh', '#63856a',-1.9,-.65),an=teammate('An · demo','#bc885f',-7.1,-2.3),linh=teammate('Linh · demo','#7294a2',6.5,-1.65);const people=[minh,an,linh];
 let phase='idle',lastPhase='',night=false,selected=minh,elapsed=0,ambientAt=12,cameraTween=null;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const points={library:new T.Vector3(-6.3,0,-2.4),desk:new T.Vector3(-1.9,0,-.65),server:new T.Vector3(6.5,0,-1.65),meeting:new T.Vector3(-5.8,0,1.6),lounge:new T.Vector3(5.8,0,3.7),entry:new T.Vector3(0,0,5.5)};
 function route(person,target){person.queue=[];const p=person.root.position;if(p.z<.7)person.queue.push(new T.Vector3(p.x,0,.75));person.queue.push(new T.Vector3(target.x,0,.75),target.clone());person.target=person.queue.shift();}
 function setPhase(next){phase=next;if(next===lastPhase)return;lastPhase=next;route(minh,points[{thinking:'library',working:'desk',reviewing:'server',complete:'meeting',idle:'lounge'}[next]||'desk']);}
 function focus(room){const target=room==='all'?new T.Vector3(0,0,0):points[room]?.clone();if(!target)return;const position=room==='all'?overview.clone():target.clone().add(new T.Vector3(7,8,9));cameraTween={from:camera.position.clone(),to:position,start:controls.target.clone(),target,t:0};}
 const raycaster=new T.Raycaster();const mouse=new T.Vector2();let down=null;
 renderer.domElement.addEventListener('pointerdown',e=>down={x:e.clientX,y:e.clientY});renderer.domElement.addEventListener('pointerup',e=>{if(!down||Math.hypot(e.clientX-down.x,e.clientY-down.y)>6)return;const rect=renderer.domElement.getBoundingClientRect();mouse.set((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1);raycaster.setFromCamera(mouse,camera);const hits=raycaster.intersectObjects([...people.map(p=>p.root),...clickables],true);if(!hits.length)return;let object=hits[0].object;while(object){const person=people.find(p=>p.root===object);if(person){selected=person;person.talkingUntil=elapsed+4;onEvent('Gặp '+person.name,person===minh?'Minh đang '+({idle:'nghỉ ngơi',thinking:'tìm ý tưởng ở thư viện',working:'làm việc tại bàn',reviewing:'kiểm tra tại phòng máy',complete:'bàn giao kết quả'}[phase]||'sẵn sàng')+'.':'Đồng nghiệp mô phỏng giúp văn phòng sinh động hơn.');return;}if(object.userData.action==='bell'){gather();return;}if(object.userData.action==='lamp'){toggleNight();return;}object=object.parent;}});
 function gather(){people.forEach((p,i)=>route(p,new T.Vector3(-6.8+i*.95,0,1.6)));onEvent('Chuông phòng họp','Mọi người đang tập trung. Bạn có thể giao nhiệm vụ tiếp theo cho Minh.');}
 function toggleNight(){night=!night;sun.intensity=night?.45:3.5;scene.background.set(night?'#263f43':'#dce5df');scene.fog.color.copy(scene.background);lampLight.intensity=night?20:6;onEvent(night?'Văn phòng lên đèn':'Chào ngày mới',night?'Một chút yên tĩnh để tập trung.':'Ánh sáng tự nhiên đã trở lại.');return night;}
 const observer=new ResizeObserver(()=>{const w=container.clientWidth,h=container.clientHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();});observer.observe(container);
 const clock=new T.Clock();renderer.setAnimationLoop(()=>{const dt=Math.min(clock.getDelta(),.05);elapsed+=dt;
  if(cameraTween){const a=cameraTween;a.t=Math.min(1,a.t+dt*1.5);const k=a.t*a.t*(3-2*a.t);camera.position.lerpVectors(a.from,a.to,k);controls.target.lerpVectors(a.start,a.target,k);if(a.t===1)cameraTween=null;}
  if(elapsed>ambientAt){ambientAt=elapsed+16;const p=Math.random()>.5?an:linh;const destinations=[points.library,points.server,points.lounge,p.home];route(p,destinations[Math.floor(Math.random()*destinations.length)]);if(phase==='idle'&&elapsed>25&&minh.queue.length===0&&minh.root.position.distanceTo(minh.target)<.1)route(minh,points.lounge);}
  for(const p of people){const delta=p.target.clone().sub(p.root.position);const distance=delta.length();p.walking=distance>.06;if(p.walking){if(reduced){p.root.position.copy(p.target);}else{delta.normalize();p.root.position.addScaledVector(delta,Math.min(distance,dt*2.5));const angle=Math.atan2(-delta.x,-delta.z);let diff=angle-p.root.rotation.y;diff=Math.atan2(Math.sin(diff),Math.cos(diff));p.root.rotation.y+=diff*Math.min(1,dt*9);}p.legs.forEach((leg,i)=>leg.rotation.x=reduced?0:Math.sin(elapsed*10+i*Math.PI)*.5);p.arms.forEach((arm,i)=>arm.rotation.x=reduced?0:-Math.sin(elapsed*10+i*Math.PI)*.4);}else{if(p.queue.length)p.target=p.queue.shift();p.legs.forEach(leg=>leg.rotation.x=0);const typing=p===minh&&phase==='working';p.arms.forEach((arm,i)=>arm.rotation.x=typing?-1+(reduced?0:Math.sin(elapsed*12+i)*.08):0);if(typing)p.root.rotation.y=0;}
   p.root.position.y=reduced?0:p.walking?Math.abs(Math.sin(elapsed*10))*.04:Math.sin(elapsed*2)*.008;p.label.position.set(p.root.position.x,2.2,p.root.position.z);p.label.material.color.set(p.talkingUntil>elapsed?'#e7c17c':'#ffffff');
  }
  leds.forEach((led,i)=>led.visible=reduced||Math.sin(elapsed*3+i)>-.6);
  const anchor=selected.root.position.clone().add(new T.Vector3(0,2.7,0)).project(camera);const nameplate=container.querySelector('.nameplate');nameplate.style.left=((anchor.x*.5+.5)*container.clientWidth)+'px';nameplate.style.top=((-anchor.y*.5+.5)*container.clientHeight)+'px';nameplate.style.display=Math.abs(anchor.x)>1||Math.abs(anchor.y)>1?'none':'block';nameplate.querySelector('.selected-name').textContent=selected.name;nameplate.querySelector('small').textContent=selected===minh?({idle:'Đang nghỉ ngơi',thinking:'Tìm ý tưởng',working:'Đang phác thảo',reviewing:'Kiểm tra · mô phỏng',complete:'Bàn giao kết quả'}[phase]||'Sẵn sàng'):'Đồng nghiệp mô phỏng';
  controls.update();renderer.render(scene,camera);
 });
 return {setPhase,focus,gather,toggleNight};
}
