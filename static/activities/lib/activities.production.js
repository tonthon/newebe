(function(){var a,b,c,d,e,f,g,h,i,j,k,l=Object.prototype.hasOwnProperty,m=function(a,b){function d(){this.constructor=a}for(var c in b)l.call(b,c)&&(a[c]=b[c]);d.prototype=b.prototype,a.prototype=new d,a.__super__=b.prototype;return a},n=function(a,b){return function(){return a.apply(b,arguments)}};f=function(){function a(){var a;$("#info-dialog").length===0&&(a=document.createElement("div"),a.id="info-dialog",a.className="dialog",a.innerHTML="Test",$("body").prepend(a)),this.element=$("#info-dialog"),this.element.hide()}a.prototype.display=function(a){this.element.empty(),this.element.append(a),this.element.show();return this.element.fadeOut(4e3)};return a}(),e=function(){function a(a){var b;$("#confirmation-dialog").length===0&&(b=document.createElement("div"),b.id="confirmation-dialog",b.className="dialog",b.innerHTML='<div id="confirmation-text"></div>',b.innerHTML+='<div id="confirmation-buttons"><span href="" id="confirmation-yes">Yes</span><span href="" id="confirmation-no">No</span></div>',$("body").prepend(b)),this.element=$("#confirmation-dialog"),this.element.hide(),this.setNoButton()}a.prototype.setNoButton=function(){var a;a=this.element;return $("#confirmation-no").click(function(){a.fadeOut();return!1})},a.prototype.display=function(a,b){$("#confirmation-text").empty(),$("#confirmation-text").append("<span>"+a+"</span>"),$("#confirmation-yes").click(b);return this.element.show()},a.prototype.hide=function(){return this.element.fadeOut()};return a}(),g=function(){function a(){var a;$("#loading-indicator").length===0&&(a=document.createElement("div"),a.id="loading-indicator",a.innerHTML='<img src="/static/images/clock_32.png" />',$("body").prepend(a)),this.element=$("#loading-indicator"),this.element.hide()}a.prototype.display=function(){return this.element.show()},a.prototype.hide=function(){return this.element.hide()};return a}(),b=function(){function a(b){var c,d;a.__super__.constructor.apply(this,arguments),this.set("author",b.author),this.set("authorKey",b.authorKey),this.set("date",b.date),this.set("docId",b.docId),this.set("verb",b.verb),this.set("docType",b.docType),this.set("method",b.method),this.set("errors",b.errors),this.set("mid",b._id),this.attributes.mid=b._id,this.setDisplayDate(),this.id=b._id,b.date&&(c=Date.parseExact(b.date,"yyyy-MM-ddTHH:mm:ssZ"),d=c.toString("yyyy-MM-dd-HH-mm-ss/"),this.attributes.urlDate=d),b.errors.length?this.attributes.errorNumber="("+b.errors.length+")":this.attributes.errorNumber=""}m(a,Backbone.Model),a.prototype.url="/activities/all/",a.prototype.getDisplayDate=function(){return this.attributes.displayDate},a.prototype.setDisplayDate=function(){var a;a=this.attributes.date;return this.setDisplayDateFromDbDate(a)},a.prototype.setDisplayDateFromDbDate=function(a){var b,c;b=Date.parseExact(a,"yyyy-MM-ddTHH:mm:ssZ"),c=b.toString("dd MMM yyyy, HH:mm"),this.attributes.displayDate=c;return b},a.prototype.getAuthor=function(){return this.get("author")},a.prototype.getAuthorKey=function(){return this.get("authorKey")},a.prototype.getDate=function(){return this.get("date")},a.prototype.getUrlDate=function(){return this.attributes.urlDate},a.prototype.getDocType=function(){return this.attributes.docType},a.prototype.getDocId=function(){return this.get("docId")},a.prototype.getMethod=function(){return this.get("method")},a.prototype.getMid=function(){return this.get("mid")},a.prototype.getErrors=function(){return this.get("errors")};return a}(),c=function(){function a(){a.__super__.constructor.apply(this,arguments)}m(a,Backbone.Collection),a.prototype.model=b,a.prototype.url="/activities/all/",a.prototype.comparator=function(a){return a.getDate()},a.prototype.parse=function(a){return a.rows};return a}(),d=function(){function a(b){this.model=b,a.__super__.constructor.call(this),this.id=this.model.id,this.model.view=this}m(a,Backbone.View),a.prototype.tagName="div",a.prototype.className="activity-row",a.prototype.template=_.template('<span class="activity-date">\n <%= displayDate %> -\n</span>\n<a href="#" class="activity-author"><%= author %></a>\n<span class="activity-verb"><%= verb %></span>\na\n<a href="#" class="doc-ref">\n<span class="activity-verb"><%= docType %></span>\n</a>\n<span class="activity-error-number">\n<%= errorNumber %>\n</span>\n<div class="activity-errors">\nErrors :\n<% _.each(errors, function(error) { %>\n  <div class="activity-error">\n    <%= error.contactName %> |\n    <%= error.contactUrl %> ->\n    <span id="<%= error.contactKey%>"\n          class="activity-error-resend">\n      resend\n    </span>\n</div>\n<% }); %>\n</div>'),a.prototype.events={mouseover:"onMouseOver",mouseout:"onMouseOut","click .doc-ref":"onDocRefClicked","click .activity-author":"onActivityAuthorClicked","click .activity-error-number":"onErrorNumberClicked","click .activity-error-resend":"onErrorResendClicked"},a.prototype.onMouseOver=function(){return $(this.el).addClass("hover-line")},a.prototype.onMouseOut=function(){return $(this.el).removeClass("hover-line")},a.prototype.onDocRefClicked=function(a){this.model.getDocType()==="micropost"?$.get("/news/micropost/"+this.model.getDocId()+"/html/",function(a){return $("#activities-preview").html(a)}):this.model.getDocType()==="note"&&$.get("/notes/"+this.model.getDocId()+"/html/",function(a){return $("#activities-preview").html(a)}),a.preventDefault();return!1},a.prototype.onActivityAuthorClicked=function(a){$.get("/contacts/render/"+this.model.getAuthorKey()+"/",function(a){return $("#activities-preview").html(a)}),a.preventDefault();return!1},a.prototype.onErrorNumberClicked=function(a){return this.$(".activity-errors").show()},a.prototype.onErrorResendClicked=function(a){var b,c,d,e,f;alert(a.target.id);if(this.model.getDocType()==="micropost")switch(this.model.getMethod()){case"POST":$(a.target).html("resending...");return $.ajax({type:"POST",url:"/news/micropost/"+this.model.getDocId()+"/retry/",data:'{"contactId": "'+a.target.id+'", "activityId":"'+this.model.id+'"}',dataType:"json",success:n(function(b){return $(a.target).html("resending succeeds.")},this),error:n(function(b){j.display("Sending data fails again.");return $(a.target).html("resend")},this)});case"DELETE":c="",f=this.model.getErrors();for(d=0,e=f.length;d<e;d++)b=f[d],b.contactKey&&b.contactKey===a.target.id&&(c=b.extra);$("#"+a.target.id).html("resending...");return $.ajax({type:"PUT",url:"/news/micropost/"+this.model.getDocId()+"/retry/",data:'{"contactId": "'+a.target.id+'", "activityId":"'+this.model.id+'", "extra":"'+c+'"}',dataType:"json",success:function(b){return $("#"+a.target.id).html("resending succeeds.")},error:function(b){j.display("Sending data fails again.");return $("#"+a.target.id).html("resend")}})}},a.prototype.render=function(){this.model.getDisplayDate()||this.model.setDisplayDate(),$(this.el).html(this.template(this.model.toJSON())),this.$(".activity-errors").hide();return this.el};return a}(),a=function(){function a(){a.__super__.constructor.apply(this,arguments)}m(a,Backbone.View),a.prototype.el=$("#activities"),a.prototype.events={"click #activities-my-button":"onMineClicked","click #activities-all-button":"onAllClicked","click #activities-sync-button":"onSyncClicked","click #activities-more":"onMoreActivitiesClicked"},a.prototype.initialize=function(){_.bindAll(this,"appendOne","prependOne","addAll"),_.bindAll(this,"displayMyActivities","onMoreActivtiesClicked","addAllMore"),_.bindAll(this,"onDatePicked"),this.tutorialOn=!0,this.activities=new c,this.activities.bind("add",this.prependOne),this.activities.bind("reset",this.addAll),this.moreActivities=new c,this.moreActivities.bind("reset",this.addAllMore);return this.currentPath="/activities/all/"},a.prototype.onMineClicked=function(a){$("#activities-my-button").button("disable"),$("#activities-all-button").button("enable"),this.clearActivities(null),$("#activities-from-datepicker").val(null),this.currentPath="/activities/mine/",this.reloadActivities(null);return a},a.prototype.onAllClicked=function(a){$("#activities-all-button").button("disable"),$("#activities-my-button").button("enable"),this.clearActivities(null),$("#activities-from-datepicker").val(null),this.currentPath="/activities/all/",this.reloadActivities(null);return a},a.prototype.onSyncClicked=function(a){$.ajax({url:"/synchronize/",success:function(){return j.display("Synchronization process started, check back your data in a few minutes.")},error:function(){return j.display("Synchronize process failed.")}});return a},a.prototype.onDatePicked=function(a,b){var c,d;c=Date.parse(a),d=c.toString("yyyy-MM-dd"),this.clearActivities();return this.reloadActivities(d)},a.prototype.clearActivities=function(){$("#activity-list").empty();return $("#activities-more").show()},a.prototype.addAllMore=function(){var a;a=this.moreActivities.toArray().reverse(),a=_.rest(a),_.each(a,this.appendOne),this.lastDate=this.moreActivities.last().getUrlDate(),a.length<30&&$("#activities-more").hide(),k.hide();return this.lastDate},a.prototype.addAll=function(){this.activities.length>0?(this.tutorialOn=!1,this.lastDate=this.activities.first().getUrlDate(),this.activities.length<30&&$("#activities-more").hide()):(this.tutorialOn?this.displayTutorial(1):$("#tutorial").html(null),$("#activities-more").hide()),this.activities.each(this.prependOne),k.hide();return this.activities.length},a.prototype.appendOne=function(a){var b,c;c=new d(a),b=c.render(),$("#activity-list").append(b);return c},a.prototype.prependOne=function(a){var b,c;c=new d(a),b=c.render(),$("#activity-list").prepend(b),k.hide(),this.tutorialOn&&(this.displayTutorial(2),this.tutorialOn=!1);return c},a.prototype.displayTutorial=function(a){return $.get("/activities/tutorial/"+a+"/",function(a){return $("#tutorial-activities").html(a)})},a.prototype.reloadActivities=function(a,b){k.display(),this.activities.url=this.currentPath,a&&(this.activities.url=this.currentPath+a+"-23-59-00/"),this.activities.fetch();return this.activities},a.prototype.fetch=function(){this.activities.fetch();return this.activties},a.prototype.onMoreActivitiesClicked=function(){k.display(),this.lastDate?this.moreActivities.url=this.currentPath+this.lastDate:this.moreActivities.url=this.currentPath,this.moreActivities.fetch();return this.moreActivities},a.prototype.setListeners=function(){return $("input#activities-from-datepicker").datepicker({onSelect:this.onDatePicked})},a.prototype.setWidgets=function(){$("#activities-my-button").button(),$("#activities-all-button").button(),$("#activities-sync-button").button(),$("#activities-all-button").button("disable"),$("#activities-more").button();return $("#activities-from-datepicker").val(null)};return a}(),k=new g,i=new e,j=new f,h=new a,h.setWidgets(),h.setListeners(),h.fetch()}).call(this)