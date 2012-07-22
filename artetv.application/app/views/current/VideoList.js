/**
 * @author andreas
 */

enyo.kind({
    name: "VideoList",
    kind: enyo.VFlexBox,
    
    jsonVideoList: [],
    jsonVideoFeed: [],

    language: "",
    localStorageName: "",  // der VideoFeed wird im LocalStorage abgespeichert. Die entsprechende Kennung erfolge ueber den Namen.
    
    
    components: [   	        
        // Grab the current video list from 7Plus
	{kind: "WebService", name: "grabVideoListFeed", handleAs: "json", onSuccess: "grabVideoListFeedSuccess", onFailure: "grabVideoListFeedFailed"},
	
	// Grab the short Information for one movie			   
	{kind: "WebService", name: "grabVideoItem", handleAs: "json", onSuccess: "grabVideoItemSuccess", onFailure: "grabVideoItemFailed"},
	
	// Grab the detail Information for one movie
	{kind: "WebService", name: "grabVideoDetails", handleAs: "json", onSuccess: "grabVideoDetailsSuccess", onFailure: "grabVideoDetailsFailed"},
	
	{kind: "Scroller", flex: 1,  components: [
	    {kind: "SpinnerLarge", pack: "center", name: "spinner"},
	    {kind: "VirtualRepeater", name: "videoList", flex:1, onSetupRow: "renderVideoListItems", components: [			
		{name: "videoItem", kind: "Item", layoutKind: "VFlexBox", onclick: "btnClickOpenVideo", layoutKind: "HFlexLayout", components: [
		    {kind: "VFlexBox", align: "left"},
		    {name: "videoTitle"},
		    {name: "videoDate"},
		    {name: "videoDescription"}			
		]}
	    ]}
	]}										
    ],


    /*
     * Dies ist die Initialisierungsfunktion der Klasse VideoList. Hier wird der erste Feed heruntergeladen.
     */
    init: function(url, localStorageName) {
	// show the spinner		
	this.$.spinner.show();
		
	this.language = arteTv.language;

	this.localStorageName = localStorageName;

	this.jsonVideoList = [];
	this.jsonVideoFeed = [];

	this.$.grabVideoListFeed.setUrl(url);
	this.$.grabVideoListFeed.call();
    },


    /*
     * If the feed loading was successfull, this function will render the items into the videoList
     */
    grabVideoListFeedSuccess: function(inSender, inResponse, inRequest) {
	if (inResponse.query.results.item != null) {			
	    var videoFeed = inResponse.query.results.item;
	    
	    // read in the old videolist
	    try {
		this.jsonVideoFeed = localStorage.getItem(this.localStorageName);
	    } catch(e) {
		this.jsonVideoFeed = [];
	    }
	    
	    if (!this.jsonVideoFeed) {
		this.jsonVideoFeed = [];
	    } else {
		this.jsonVideoFeed = JSON.parse(this.jsonVideoFeed);
	    }
	    
	    // have a look if we already have this video in our list
	    try {
		var oldVideoFeedLength = this.jsonVideoFeed.length;
	    } catch(e) {
		var oldVideoFeedLength = 0;
	    }	    	    

	    var responseLength = videoFeed.length;

	    var i = 0;
	    while (i < responseLength) {
		// this link we have to save for later using				
		var videoFeedLink = videoFeed[i].link;			

		
		var found = false;
		var x = 0;

		while (x < oldVideoFeedLength && !found) {
		    try {
			if (this.jsonVideoFeed[x].guid == videoFeed[i].guid.content) {
			    // video already in the list
			    found = true;
			} 
		    } catch(e) { }
		    
		    x++;
		}
		
		// save the video only when we still not have it
		if (!found) {				
		    // Transmode the link to the PlayerXML file. In that file we will find the Link to the long description		
		    var link = videoFeed[i].link.replace("videos/","do_delegate/videos/");
		    link = link.replace(".html",",view,asPlayerXml.xml");		

		    // save the video feed permanently
		    this.jsonVideoFeed.push({"videolink": link, 
					     "description": videoFeed[i].description, 
					     "pubdate": videoFeed[i].pubDate, 
					     "guid": videoFeed[i].guid.content, 
					     "videofeedlink": videoFeedLink});					
		    
		}
		
		i++;
	    }				
	    

	    var i = this.jsonVideoFeed.length-1;

	    var copy = [];
	    while (i >= 0) 
	    {				
		// Grab the short information
		try  {
		    // video item is older then seven days, then it can be deleted, because it will not be longer online
		    //alert(this.jsonVideoFeed[i].pubdate+"    "+(Date.parse(Date().toLocaleString())-Date.parse(this.jsonVideoFeed[i].pubdate)));
		    if (Date.parse(Date().toLocaleString())-Date.parse(this.jsonVideoFeed[i].pubdate) >= 682709000) {

			// do nothing
			//enyo.log(Date.parse(Date().toLocaleString())-Date.parse(this.jsonVideoFeed[i].pubdate));										
		    } else {						
			copy.push(this.jsonVideoFeed[i]);
			this.$.grabVideoItem.setUrl("http://query.yahooapis.com/v1/public/yql?q="
						    +"select%20*%20from%20xml%20where%20url%3D%22"
						    +encodeURI(this.jsonVideoFeed[i].videolink)+"%22&format=json&callback=");
			this.$.grabVideoItem.call();
		    }
		} catch(e) { }
		
		i--;
	    }
	    this.jsonVideoFeed = copy;
	    localStorage.setItem(this.localStorageName,JSON.stringify(copy));		
	}
    },
    
    /*
     *  If the loading of the short description was successfull, this function will load the long description. Only in that is the direct
     *  link to the video and the important preview picture 
     */
    grabVideoItemSuccess: function(inSender, inResponse, inRequest) {
	if (inResponse != null) {
	    // The response will be a xml file. These we will convert to a JSON object
	    var res= inResponse;
	    res = res.query.results;	
	    // Get the link to the german video long description
	    try {			
		if (res.videoref.videos.video[0].lang == this.language) {
		    this.$.grabVideoDetails.setUrl("http://query.yahooapis.com/v1/public/yql?q="
						   +"select%20*%20from%20xml%20where%20url%3D"
						   +encodeURI(JSON.stringify(res.videoref.videos.video[0].ref))
						   +"&format=json&callback=");
		} else {
		    this.$.grabVideoDetails.setUrl("http://query.yahooapis.com/v1/public/yql?q="
						   +"select%20*%20from%20xml%20where%20url%3D"
						   +encodeURI(JSON.stringify(res.videoref.videos.video[1].ref))
						   +"&format=json&callback=");
		}				
				this.$.grabVideoDetails.call();		
	    } catch(e) {}
	}
    },
    
    /*
     * If the loading of the video details was successfull, then these function will set all the needed information and 
     * start the VirtualRepeater redering
     */
    grabVideoDetailsSuccess: function(inSender, inResponse, inRequest) {
	if (inResponse != null) {
	    // The response will be a xml file. These we will convert to a JSON object
	    var res = inResponse;
	    res = res.query.results;
	    

	    // Read the needing information and store it
	    try {
		this.jsonVideoList.push(res);
	    } catch(e) { }
	    this.$.videoList.render();
	}
    },
    
    
    /*
     * Render the videoList
     */
    renderVideoListItems: function(inSender, inIndex) {				
	var item = this.jsonVideoList[inIndex];
	if (item) {
	    item = item.video;
	    
	    // Create the VideListItem
	    this.$.videoTitle.setContent(item.name);
	    this.$.videoItem.setStyle("background-image: url("+item.firstThumbnailUrl+");")
	    this.$.videoDate.setContent(item.dateVideo.substring(0,16));
	    
	    // get out the short description to this video
	    var i = this.jsonVideoFeed.length;
	    var found = false;
	    var description = "";
	    while ( i > 0 && found == false) {
		try  {
		    if (this.jsonVideoFeed[i].videofeedlink == item.url) {
			description = this.jsonVideoFeed[i].description;
			found = true;
		    }
		} catch(e) {}
		i--;
	    }
	    description = description.replace(/\\n/g,"\r\n");	
	    description = description.replace(/\\\"/g,"\"");
	    this.$.videoDescription.setContent(description);
	    
	    return true;
	} {
	    this.$.spinner.hide();
	}
	
	
    },
    
    /*
     * Open the selected video
     */
    btnClickOpenVideo: function(inSender, inEvent) {		
	var showVideo = new ShowVideo();
	showVideo.openAtCenter();
	
	// get out the video object
	var i = this.jsonVideoFeed.length;
	var found = false;
	var video = [];		
	while ( i > 0 && found == false) {
	    try  {
		if (this.jsonVideoFeed[i].videofeedlink == this.jsonVideoList[inEvent.rowIndex].video.url) {
		    video = this.jsonVideoFeed[i];
		    found = true;
		}
	    } catch(e) {}
	    i--;
	}
	showVideo.showVideoItem(this.jsonVideoList[inEvent.rowIndex],video);
    },
    
	

}); 
