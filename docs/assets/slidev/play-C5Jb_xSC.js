const __vite__fileDeps=["assets/slidev/DrawingControls-DdvmfVPZ.js","assets/modules/unplugin-icons-Db5cH8pe.js","assets/modules/vue-qDBvoHgk.js","assets/modules/shiki-BnrpArDE.js","assets/modules/shiki-BSchMNmt.css","assets/slidev/DrawingPreview-Dks-3gPd.js","assets/index-CH24ehoa.js","assets/monaco/bundled-types-OWRw7kr6.js","assets/modules/file-saver-DY7lxZlc.js","assets/monaco/bundled-types-BRmEmvcP.css","assets/index-BMoXUts2.css","assets/DrawingPreview-Ca_HKmwu.css","assets/slidev/ContextMenu-PEWEThD-.js","assets/slidev/IconButton-Bv9BflQl.js","assets/slidev/context-0usB3Fxo.js","assets/ContextMenu-DcKhlHdP.css","assets/DrawingControls-C5T1oZL5.css"],__vite__mapDeps=i=>i.map(i=>__vite__fileDeps[i]);
import{d as v,a7 as P,o,c as d,H as e,b as f,e as a,f as I,i as M,g as i,af as B,y as j,k,ag as $,a6 as E,Q as y,l as p,F as N,x as D,v as H,h as R,t as O}from"../modules/vue-qDBvoHgk.js";import{_ as g,a as z,k as b,l as V,s as C,m as T,e as S,w as W,n as A}from"../index-CH24ehoa.js";import{Q as L,G as Q,C as U,u as F,r as G,S as K,N as X,o as Y}from"./ContextMenu-PEWEThD-.js";import{a as w,_ as q,h as J,j as Z}from"../monaco/bundled-types-OWRw7kr6.js";import{c as ee,a as te}from"./DrawingPreview-Dks-3gPd.js";import{o as oe}from"../modules/unplugin-icons-Db5cH8pe.js";import"../modules/shiki-BnrpArDE.js";import"../modules/file-saver-DY7lxZlc.js";import"./IconButton-Bv9BflQl.js";import"./context-0usB3Fxo.js";const se="/assets/logo-BYkHSa_O.png",ne={key:0,class:"fixed top-0 bottom-0 left-0 right-0 grid z-20"},le=v({__name:"Modal",props:{modelValue:{default:!1},class:{default:""}},emits:["update:modelValue"],setup(m,{emit:r}){const n=m,l=P(n,"modelValue",r);function u(){l.value=!1}return(_,s)=>(o(),d(B,null,[e(l)?(o(),f("div",ne,[a("div",{bg:"black opacity-80",class:"absolute top-0 bottom-0 left-0 right-0 -z-1",onClick:s[0]||(s[0]=c=>u())}),a("div",{class:M(["m-auto rounded-md bg-main shadow",n.class]),"dark:border":"~ main"},[I(_.$slots,"default")],2)])):i("v-if",!0)],1024))}}),ae=g(le,[["__file","/home/addamsson/projects/effect-workshop/node_modules/.pnpm/@slidev+client@0.49.3_postcss@8.4.38_vite@5.2.11/node_modules/@slidev/client/internals/Modal.vue"]]),ie={class:"slidev-info-dialog slidev-layout flex flex-col gap-4 text-base"},re=["innerHTML"],de=a("a",{href:"https://github.com/slidevjs/slidev",target:"_blank",class:"!opacity-100 !border-none !text-current"},[a("div",{class:"flex gap-1 children:my-auto"},[a("div",{class:"opacity-50 text-sm mr-2"},"Powered by"),a("img",{class:"w-5 h-5",src:se,alt:"Slidev logo"}),a("div",{style:{color:"#2082A6"}},[a("b",null,"Sli"),E("dev ")])])],-1),ue=v({__name:"InfoDialog",props:{modelValue:{default:!1}},emits:["update:modelValue"],setup(m,{emit:r}){const l=P(m,"modelValue",r),u=j(()=>typeof w.info=="string");return(_,s)=>(o(),d(ae,{modelValue:e(l),"onUpdate:modelValue":s[0]||(s[0]=c=>$(l)?l.value=c:null),class:"px-6 py-4"},{default:k(()=>[a("div",ie,[u.value?(o(),f("div",{key:0,class:"mb-4",innerHTML:e(w).info},null,8,re)):i("v-if",!0),de])]),_:1},8,["modelValue"]))}}),ce=g(ue,[["__file","/home/addamsson/projects/effect-workshop/node_modules/.pnpm/@slidev+client@0.49.3_postcss@8.4.38_vite@5.2.11/node_modules/@slidev/client/internals/InfoDialog.vue"]]),pe=v({__name:"Controls",setup(m){const{isEmbedded:r}=z(),n=!w.drawings.presenterOnly&&!r.value,t=y();n&&q(()=>import("./DrawingControls-DdvmfVPZ.js"),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16])).then(_=>t.value=_.default);const l=y(),u=y();return(_,s)=>(o(),f(N,null,[e(n)&&t.value?(o(),d(e(t),{key:0})):i("v-if",!0),p(L),p(Q),l.value?(o(),d(e(l),{key:1})):i("v-if",!0),u.value?(o(),d(e(u),{key:2,modelValue:e(b),"onUpdate:modelValue":s[0]||(s[0]=c=>$(b)?b.value=c:null)},null,8,["modelValue"])):i("v-if",!0),e(w).info?(o(),d(ce,{key:3,modelValue:e(V),"onUpdate:modelValue":s[1]||(s[1]=c=>$(V)?V.value=c:null)},null,8,["modelValue"])):i("v-if",!0),p(U)],64))}}),me=g(pe,[["__file","/home/addamsson/projects/effect-workshop/node_modules/.pnpm/@slidev+client@0.49.3_postcss@8.4.38_vite@5.2.11/node_modules/@slidev/client/internals/Controls.vue"]]),_e=v({__name:"PrintStyle",setup(m){function r(n,{slots:t}){if(t.default)return H("style",t.default())}return(n,t)=>(o(),d(r,null,{default:k(()=>[E(" @page { size: "+D(e(J))+"px "+D(e(Z))+"px; margin: 0px; } ",1)]),_:1}))}}),fe=g(_e,[["__file","/home/addamsson/projects/effect-workshop/node_modules/.pnpm/@slidev+client@0.49.3_postcss@8.4.38_vite@5.2.11/node_modules/@slidev/client/internals/PrintStyle.vue"]]),ve={key:0,class:"absolute top-0 left-0 right-0 bottom-0 pointer-events-none text-xl"},ge=v({__name:"PresenterMouse",setup(m){return(r,n)=>{const t=oe;return e(C).cursor?(o(),f("div",ve,[p(t,{class:"absolute stroke-white dark:stroke-black",style:R({left:`${e(C).cursor.x}%`,top:`${e(C).cursor.y}%`,strokeWidth:16})},null,8,["style"])])):i("v-if",!0)}}}),he=g(ge,[["__file","/home/addamsson/projects/effect-workshop/node_modules/.pnpm/@slidev+client@0.49.3_postcss@8.4.38_vite@5.2.11/node_modules/@slidev/client/internals/PresenterMouse.vue"]]),ye=a("div",{id:"twoslash-container"},null,-1),ke=v({__name:"play",setup(m){const{next:r,prev:n,isPrintMode:t}=z(),{isDrawing:l}=ee(),u=O();function _(h){var x;S.value||h.button===0&&((x=h.target)==null?void 0:x.id)==="slide-container"&&(h.pageX/window.innerWidth>.5?r():n())}F(u),G();const s=j(()=>T.value||S.value),c=y();return(h,x)=>(o(),f(N,null,[e(t)?(o(),d(fe,{key:0})):i("v-if",!0),a("div",{id:"page-root",ref_key:"root",ref:u,class:M(["grid",e(A)?"grid-rows-[1fr_max-content]":"grid-cols-[1fr_max-content]"])},[p(te,{style:{background:"var(--slidev-slide-container-background, black)"},width:e(t)?e(W).width.value:void 0,"is-main":"",onPointerdown:_,onContextmenu:e(Y)},{default:k(()=>[p(K,{"render-context":"slide"}),p(he)]),controls:k(()=>[e(t)?i("v-if",!0):(o(),f("div",{key:0,class:M(["absolute bottom-0 left-0 transition duration-300 opacity-0 hover:opacity-100",[s.value?"!opacity-100 right-0":"opacity-0 p-2",e(l)?"pointer-events-none":""]])},[p(X,{persist:s.value},null,8,["persist"])],2))]),_:1},8,["width","onContextmenu"]),c.value&&e(S)?(o(),d(e(c),{key:0,resize:!0})):i("v-if",!0)],2),e(t)?i("v-if",!0):(o(),d(me,{key:1})),ye],64))}}),je=g(ke,[["__file","/home/addamsson/projects/effect-workshop/node_modules/.pnpm/@slidev+client@0.49.3_postcss@8.4.38_vite@5.2.11/node_modules/@slidev/client/pages/play.vue"]]);export{je as default};
