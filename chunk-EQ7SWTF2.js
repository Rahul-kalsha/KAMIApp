import{a as U}from"./chunk-QNKBPRHA.js";import{a as w}from"./chunk-E2KFHGHR.js";import{a as M}from"./chunk-RAI7CN5A.js";import{K as d,L as o,M as c,Na as I,Oa as _,Ra as E,T as f,Ta as C,Y as l,Ya as O,da as t,ea as i,fa as b,ga as h,ha as y,ma as S,ra as n,sa as m,t as u,ta as s,x,y as g,ya as P}from"./chunk-GJLT4NFV.js";var v=class r{http=x(C);baseUrl=`${M.apiUrl}/users`;getUser(a){return this.http.get(`${this.baseUrl}/${a}`)}static \u0275fac=function(e){return new(e||r)};static \u0275prov=u({token:r,factory:r.\u0275fac,providedIn:"root"})};function F(r,a){r&1&&b(0,"app-spinner",4),r&2&&l("overlay",!0)}function A(r,a){if(r&1&&(t(0,"div",32)(1,"div",33)(2,"h6",34),n(3),i(),t(4,"p",9),n(5),i()()()),r&2){let e=a.$implicit;o(3),m(e.title),o(2),m(e.body)}}function T(r,a){r&1&&(t(0,"p",35),n(1," No posts found. "),i())}function k(r,a){if(r&1&&(h(0),t(1,"div",5)(2,"div",6),b(3,"img",7),t(4,"h4",8),n(5),i(),t(6,"p",9),n(7),i()()(),t(8,"div",10)(9,"div",11)(10,"h5",12),n(11,"Personal Information"),i(),t(12,"div",13)(13,"div",14)(14,"div",15)(15,"span",16),n(16,"NAME"),i(),t(17,"p",17),n(18),i()()(),t(19,"div",14)(20,"div",15)(21,"span",18),n(22,"EMAIL"),i(),t(23,"p",19)(24,"a",20),n(25),i()()()(),t(26,"div",14)(27,"div",15)(28,"span",21),n(29,"PHONE"),i(),t(30,"p",22)(31,"a",20),n(32),i()()()(),t(33,"div",14)(34,"div",15)(35,"span",23),n(36,"WEBSITE"),i(),t(37,"p",24)(38,"a",25),n(39),i()()()(),t(40,"div",14)(41,"div",15)(42,"span",26),n(43,"COMPANY"),i(),t(44,"p",27),n(45),i()()()()()(),t(46,"div",28)(47,"div",11)(48,"h5",12),n(49,"Posts"),i(),t(50,"div",29)(51,"div",13),f(52,A,6,2,"div",30),i(),f(53,T,2,0,"p",31),i()()(),y()),r&2){let e=S();o(5),m(e.user.name),o(2),m("@"+e.user.username),o(11),s(" ",e.user.name," "),o(6),l("href","mailto:"+e.user.email,d),o(),s(" ",e.user.email," "),o(6),l("href","tel:"+e.user.phone,d),o(),s(" ",e.user.phone," "),o(6),l("href","https://"+e.user.website,d),o(),s(" ",e.user.website," "),o(6),s(" ",e.user.company.name," "),o(7),l("ngForOf",e.posts),o(),l("ngIf",e.posts.length===0)}}var L=class r{constructor(a,e,p){this.usersService=a;this.postsService=e;this.route=p}user=null;posts=[];loading=!1;ngOnInit(){this.loadUserProfile()}loadUserProfile(){this.loading=!0;let a=Number(this.route.snapshot.paramMap.get("id"));this.usersService.getUser(a).subscribe({next:e=>{this.user=e,this.loadUserPosts(a)},error:e=>{console.error("Error loading user:",e),this.loading=!1}})}loadUserPosts(a){this.postsService.getPosts({userId:a}).subscribe({next:e=>{this.posts=e.body||[],this.loading=!1},error:e=>{console.error("Error loading posts:",e),this.loading=!1}})}static \u0275fac=function(e){return new(e||r)(c(v),c(U),c(O))};static \u0275cmp=g({type:r,selectors:[["app-profile"]],standalone:!0,features:[P],decls:4,vars:2,consts:[[1,"common-container","profile-container"],[1,"content-wrapper","profile-section"],["message","Loading data...",3,"overlay",4,"ngIf"],[4,"ngIf"],["message","Loading data...",3,"overlay"],[1,"profile-header","rounded-3","p-5","mb-4"],[1,"text-center"],["src","assets/images/user-avatar.jpg","alt","Profile picture",1,"rounded-circle","profile-avatar","mb-3"],[1,"mb-1"],[1,"text-muted","mb-0"],[1,"card","mb-4"],[1,"card-body"],[1,"card-title","mb-4"],[1,"row","g-4"],[1,"col-md-4"],[1,"info-group"],["id","nameLabel",1,"text-muted","small"],["aria-labelledby","nameLabel","role","textbox","aria-readonly","true",1,"mb-0"],["id","emailLabel",1,"text-muted","small"],["aria-labelledby","emailLabel","role","textbox","aria-readonly","true",1,"mb-0"],[1,"text-primary","text-decoration-none",3,"href"],["id","phoneLabel",1,"text-muted","small"],["aria-labelledby","phoneLabel","role","textbox","aria-readonly","true",1,"mb-0"],["id","websiteLabel",1,"text-muted","small"],["aria-labelledby","websiteLabel","role","textbox","aria-readonly","true",1,"mb-0"],["target","_blank",1,"text-primary","text-decoration-none",3,"href"],["id","companyLabel",1,"text-muted","small"],["aria-labelledby","companyLabel","role","textbox","aria-readonly","true",1,"mb-0"],[1,"card"],[1,"posts-list"],["class","col-md-6 col-lg-6",4,"ngFor","ngForOf"],["class","text-muted",4,"ngIf"],[1,"col-md-6","col-lg-6"],[1,"post-item","h-100","p-1"],[1,"text-primary","mb-2"],[1,"text-muted"]],template:function(e,p){e&1&&(t(0,"div",0)(1,"div",1),f(2,F,1,1,"app-spinner",2)(3,k,54,12,"ng-container",3),i()()),e&2&&(o(2),l("ngIf",p.loading),o(),l("ngIf",!p.loading&&p.user))},dependencies:[E,I,_,w],styles:[".profile-container[_ngcontent-%COMP%]{padding:1rem;min-height:100vh;display:flex;justify-content:center}.profile-section[_ngcontent-%COMP%]{max-width:700px}.profile-header[_ngcontent-%COMP%]{background-color:#f0f1ff}.profile-avatar[_ngcontent-%COMP%]{width:120px;height:120px;object-fit:cover;border:4px solid white;box-shadow:0 2px 8px #0000001a}.info-group[_ngcontent-%COMP%]   label[_ngcontent-%COMP%]{display:block;margin-bottom:4px;text-transform:uppercase;font-weight:500}.post-item[_ngcontent-%COMP%]{padding-bottom:1.5rem;border-bottom:1px solid #eee}.post-item[_ngcontent-%COMP%]:last-child{border-bottom:none;padding-bottom:0}.post-item[_ngcontent-%COMP%]   h6[_ngcontent-%COMP%]{font-weight:500}"]})};export{L as ProfileComponent};