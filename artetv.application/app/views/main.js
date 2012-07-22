/**
 * @author andreas
 */

enyo.kind({
    name: "ArteTV",
    kind: enyo.VFlexBox,
    
    jsonVideoList: [],
    jsonVideoDescription: [],

    url: "",

    language: "de",
    
    components: [
        {kind: "ApplicationEvents", onLoad: "initializeHightlightsVideoList"},
        
	
        {kind: "PageHeader", layoutKind: "HFlexLayout", style:"height:60px", components: [
            {kind: "Spacer"},     	
       	    {kind: "Image", style: "height: 30px;", src: "images/arte-logo.png"},
       	    {kind: "Spacer"},
       	    {kind: "Image", onclick: "btnInfo", src: "images/info.png"},
        ]},
	
	{kind: "Pane", name: "MainView", flex: 1, transitionKind: "enyo.transitions.LeftRightFlyin", components: [
	    {kind: "VideoList", name: "SevenPlus"},
   	    {kind: "LiveShowVideo", name: "Live"},
   	    {kind: "VideoList", name: "Reportagen"},
   	    {kind: "VideoList", name: "Junior"}
   	]},			
	
	{kind: "Toolbar", components: [
	    {kind: "RadioToolButtonGroup", components: [
		{caption: "ARTE 7+", onclick: "btnShowSevenPlus"},
		{caption: "Live", onclick: "btnShowLive"},
		{caption: "Reportagen", onclick: "btnShowReportagen"},
		{caption: "Junior", onclick: "btnShowJunior"}
	    ]}
	]},
	
	{kind: "Popup", name: "infoWindow", onclick: "btnInfoClose", components: [
	    {kind: "PageHeader", layoutKind: "HFlexLayout", pack: "Center", style:"height:60px", components: [
		{kind: "Image", style: "height: 30px;", src: "images/arte-logo.png"}
	    ]},
	    {content: "This is a unofficial ArteTV app based at the public RSS feeds of ARTE. ARTE doesn't support this app and is also not the owner or developer."},
	    {content: "For failures, questions, more informations or feature requests, please contact us via our website."},
	    {content: "www.aventer.biz", name: "url"},	
	    {content: "avEnter - UG (haftungsbeschränkt)", name: "company"}
	]}
	
    ],
    
    /*
     * This function will be loaded after the app was starting. This function will load the current 7Plus Video List
     */
    initializeHightlightsVideoList: function(inSender) {
	this.language = enyo.g11n.currentLocale().getLanguage();


	// Nach dem Starten der App, soll als ersten SevenPlus angezeigt werden
	this.$.MainView.selectViewByName("SevenPlus");

	var url = "http://query.yahooapis.com/v1/public/yql?q="
	    + "select%20title%2C%20pubDate%2C%20link%2C%20description%2C%20guid"
	    + "%20from%20rss%20where%20url%3D%22"
	    + encodeURI("http://videos.arte.tv/"+this.language+"/do_delegate/videos/index-3188626,view,rss.xml")
	    + "%22&format=json&callback=";

	this.$.SevenPlus.init(url);

    },
    
    /*
     * Click on the toolbar Button "SevenPlus"
     */
    btnShowSevenPlus: function() {
	this.$.MainView.selectViewByName("SevenPlus");

	var url = "http://query.yahooapis.com/v1/public/yql?q="
	    + "select%20title%2C%20pubDate%2C%20link%2C%20description%2C%20guid"
	    + "%20from%20rss%20where%20url%3D%22"
	    + encodeURI("http://videos.arte.tv/"+this.language+"/do_delegate/videos/index-3188626,view,rss.xml")
	    + "%22&format=json&callback=";

	this.$.SevenPlus.init(url, "SevenPlus");
    },
    
    /*
     * Click on the toolbar Button "Live"
     */
    btnShowLive: function() {
	this.$.MainView.selectViewByName("Live");
    },
    
    /*
     * Click on the toolbar Button "Reportagen"
     */
    btnShowReportagen: function() {
	this.$.MainView.selectViewByName("Reportagen");

	var url = "http://query.yahooapis.com/v1/public/yql?q="
	    + "select%20title%2C%20pubDate%2C%20link%2C%20description%2C%20guid"
	    + "%20from%20rss%20where%20url%3D%22"
	    + encodeURI("http://videos.arte.tv/"+this.language+"/do_delegate/videos/themen/dokus/index-3188646,view,rss.xml")
	    + "%22&format=json&callback=";

	this.$.Reportagen.init(url, "Reportagen");
    },

    /*
     * Click on the toolbar Button "Junior"
     */
    btnShowJunior: function() {
	this.$.MainView.selectViewByName("Junior");

	var url = "http://query.yahooapis.com/v1/public/yql?q="
	    + "select%20title%2C%20pubDate%2C%20link%2C%20description%2C%20guid"
	    + "%20from%20rss%20where%20url%3D%22"
	    + encodeURI("http://videos.arte.tv/"+this.language+"/do_delegate/videos/themen/junior/index-3188656,view,rss.xml")
	    + "%22&format=json&callback=";

	this.$.Junior.init(url, "Junior");
    },
    
    /*
     * Open Info Popup
     */
    btnInfo: function() {
	this.$.infoWindow.openAtCenter();
    },
    
    /*
     * Close info popup
     */
    btnInfoClose: function() {
	this.$.infoWindow.close();
    }
	
}); 
