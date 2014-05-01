$(document).ready(function () {
	$.ajax({
		url:"http://huangchaosuper.duapp.com/service/rss/trigger",
		async:true,
		crossDomain : true,
	});
	var rssReaderViewModel = new viewModel();
	ko.applyBindings(rssReaderViewModel);
	rssReaderViewModel.tech();
	$("#rss_reader_all").click({ handler: rssReaderViewModel.all });
	$("#rss_reader_tech").click({ handler: rssReaderViewModel.tech });
	$("#rss_reader_news").click({ handler: rssReaderViewModel.news });
	$("#rss_reader_preview").click({ handler: rssReaderViewModel.preview });
	$("#rss_reader_first").click({ handler: rssReaderViewModel.first });
	$("#rss_reader_next").click({ handler: rssReaderViewModel.next });
});

function viewModel() {
	var self = this;
	var rangeFrom=0;
	var rangeSize=8;
	var typeId="tech";
	self.docs = ko.observableArray([]);
	self.all = function () {
		typeId=null;
		self.getInformationFromRssReader(rangeFrom,rangeSize,typeId);
	};
	self.tech = function () {
		typeId="tech";
		self.getInformationFromRssReader(rangeFrom,rangeSize,typeId);
	};
	self.news = function () {
		typeId="news";
		self.getInformationFromRssReader(rangeFrom,rangeSize,typeId);
	};
	self.preview = function () {
		if(rangeFrom<=0){
			rangeFrom = 0;
		}else{
			rangeFrom = rangeFrom-rangeSize;
		}
		self.getInformationFromRssReader(rangeFrom,rangeSize,typeId);
	};
	self.first = function () {
		rangeFrom = 0;
		self.getInformationFromRssReader(rangeFrom,rangeSize,typeId);
	};
	self.next = function () {
		rangeFrom = rangeFrom+rangeSize;
		self.getInformationFromRssReader(rangeFrom,rangeSize,typeId);
	};
	self.getInformationFromRssReader = function(rangeFrom,rangeSize,typeId){
		var queryCondition = new Object();
		queryCondition.from=rangeFrom;
		queryCondition.to=rangeFrom+rangeSize;
		if(!typeId){}else{
			queryCondition.typeId = typeId;
		}
		$.ajax({
			url:"http://huangchaosuper.duapp.com/service/rss/read",
			data:queryCondition,
			async:true,
			crossDomain : true,
			dataType: "json", 
			success: function (data) {     
				self.docs(data.docs);
			},
			error: function (XMLHttpRequest, textStatus, errorThrown) { 
				alert(errorThrown); 
			} 
		});
	};
}
