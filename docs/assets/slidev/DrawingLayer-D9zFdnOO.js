import{d as l,t as i,ac as c,D as m,J as u,o as p,b as d,i as f,H as a}from"../modules/vue-qDBvoHgk.js";import{u as _}from"./context-D9leBwJm.js";import{c as v}from"./DrawingPreview-Bn2a3BTU.js";import{_ as g}from"../index-7ixfqLpl.js";import"../monaco/bundled-types-BMrb6fwg.js";import"../modules/file-saver-DY7lxZlc.js";import"../modules/shiki-BnrpArDE.js";const w=l({__name:"DrawingLayer",setup(h){const{drauu:e,drawingEnabled:n,loadCanvas:t}=v(),r=_().$scale,o=i();return c(()=>{e.mount(o.value,o.value.parentElement),m(r,s=>e.options.coordinateScale=1/s,{immediate:!0}),t()}),u(()=>{e.unmount()}),(s,D)=>(p(),d("svg",{ref_key:"svg",ref:o,class:f(["w-full h-full absolute top-0",{"pointer-events-none":!a(n),"touch-none":a(n)}])},null,2))}}),L=g(w,[["__file","/home/addamsson/projects/effect-workshop/node_modules/.pnpm/@slidev+client@0.49.3_postcss@8.4.38_vite@5.2.11/node_modules/@slidev/client/internals/DrawingLayer.vue"]]);export{L as default};