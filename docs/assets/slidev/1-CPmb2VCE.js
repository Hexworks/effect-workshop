import{d as p,y as m,o as i,b as _,e as r,f,h,c as v,k as g,q as k,s as y,H as a}from"../modules/vue-qDBvoHgk.js";import{u as d,p as x,f as b}from"./context-BzB70Ce_.js";import{_ as u,V as c}from"../index-Bm4ERI8X.js";import"../monaco/bundled-types-DbQtWvin.js";import"../modules/file-saver-DY7lxZlc.js";import"../modules/shiki-BnrpArDE.js";function l(e){return e.startsWith("/")?"/"+e.slice(1):e}function B(e,s=!1){const t=e&&["#","rgb","hsl"].some(n=>e.indexOf(n)===0),o={background:t?e:void 0,color:e&&!t?"white":void 0,backgroundImage:t?void 0:e?s?`linear-gradient(#0005, #0008), url(${l(e)})`:`url("${l(e)}")`:void 0,backgroundRepeat:"no-repeat",backgroundPosition:"center",backgroundSize:"cover"};return o.background||delete o.background,o}const $={class:"my-auto w-full"},w=p({__name:"cover",props:{background:{default:"https://source.unsplash.com/collection/94734566/1920x1080"}},setup(e){d();const s=e,t=m(()=>B(s.background,!0));return(o,n)=>(i(),_("div",{class:"slidev-layout cover text-center",style:h(t.value)},[r("div",$,[f(o.$slots,"default")])],4))}}),C=u(w,[["__file","/home/addamsson/projects/effect-workshop/node_modules/.pnpm/@slidev+theme-seriph@0.25.0/node_modules/@slidev/theme-seriph/layouts/cover.vue"]]),P=r("p",null,"A gentle introduction to",-1),S=r("h1",null,"Effect",-1),z={__name:"1",setup(e){return x(c),d(),(s,t)=>(i(),v(C,k(y(a(b)(a(c),0))),{default:g(()=>[P,S]),_:1},16))}},q=u(z,[["__file","/@slidev/slides/1.md"]]);export{q as default};
