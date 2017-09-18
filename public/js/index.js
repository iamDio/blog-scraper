$(".scrape-btn").on("click", function(e) {
	console.log(e);
	$.ajax({
		url: "/scrape",
		type: "GET",

		success: function(res) {
			location.href = "/articles";
		}
	});
});

