/**
 * @author andreas
 */

enyo.kind({
    name: "LiveShowVideo",
    kind: enyo.VFlexBox,
    
    videoItem: [],
    
    components: [
    	{kind: "SpinnerLarge", name: "spinner"},
    	    
    	{kind: "ApplicationEvents", onLoad: "initializeLiveShowVideoShowVideo"},
    	
    	{kind: "HFlexBox", pack: "center", components: [
			{kind: (window.PalmSystem ? enyo.WebView : enyo.Iframe), style:"height:430px;width:650px;", name: "videoWebView", onLoadComplete: "videoWebViewHideSpinner", onLoadStarted: "videoWebViewShowSpinner"}
		]}
	],
	
	/*
	 * This function will be activated at start
	 */
	initializeLiveShowVideoShowVideo: function() {		
		this.$.videoWebView.setUrl("http://www.aventer.biz/api/artelive.php");					
	},
	
	/*
	 * The video is loaded. Hide the spinner
	 */
	videoWebViewHideSpinner: function() {
		this.$.spinner.hide();
	},
	

	/*
	 * The video is loading. Show the spinner
	 */
	videoWebViewShowSpinner: function() {
		this.$.spinner.show();
	}
	
	
}); 