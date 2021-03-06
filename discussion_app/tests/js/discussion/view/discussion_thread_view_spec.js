// Generated by CoffeeScript 1.6.1
(function() {

  describe("DiscussionThreadView", function() {
    beforeEach(function() {
      setFixtures("<script type=\"text/template\" id=\"thread-template\">\n    <article class=\"discussion-article\">\n        <div class=\"response-count\"/> \n        <ol class=\"responses\"/>\n        <div class=\"response-pagination\"/>\n    </article>\n</script>\n<div class=\"thread-fixture\"/>");
      jasmine.Clock.useMock();
      this.threadData = {
        id: "dummy"
      };
      this.thread = new Thread(this.threadData);
      this.view = new DiscussionThreadView({
        model: this.thread
      });
      this.view.setElement($(".thread-fixture"));
      spyOn($, "ajax");
      spyOn(this.view.showView, "render");
      spyOn(this.view, "makeWmdEditor");
      return spyOn(DiscussionThreadView.prototype, "renderResponse");
    });
    return describe("response count and pagination", function() {
      var assertRenderedCorrectly, renderWithContent;
      renderWithContent = function(view, content) {
        DiscussionViewSpecHelper.setNextResponseContent(content);
        view.render();
        return jasmine.Clock.tick(100);
      };
      assertRenderedCorrectly = function(view, countText, displayCountText, buttonText) {
        expect(view.$el.find(".response-count").text()).toEqual(countText);
        if (displayCountText) {
          expect(view.$el.find(".response-display-count").text()).toEqual(displayCountText);
        } else {
          expect(view.$el.find(".response-display-count").length).toEqual(0);
        }
        if (buttonText) {
          return expect(view.$el.find(".load-response-button").text()).toEqual(buttonText);
        } else {
          return expect(view.$el.find(".load-response-button").length).toEqual(0);
        }
      };
      it("correctly render for a thread with no responses", function() {
        renderWithContent(this.view, {
          resp_total: 0,
          children: []
        });
        return assertRenderedCorrectly(this.view, "0 responses", null, null);
      });
      it("correctly render for a thread with one response", function() {
        renderWithContent(this.view, {
          resp_total: 1,
          children: [{}]
        });
        return assertRenderedCorrectly(this.view, "1 response", "Showing all responses", null);
      });
      it("correctly render for a thread with one additional page", function() {
        renderWithContent(this.view, {
          resp_total: 2,
          children: [{}]
        });
        return assertRenderedCorrectly(this.view, "2 responses", "Showing first response", "Load all responses");
      });
      it("correctly render for a thread with multiple additional pages", function() {
        renderWithContent(this.view, {
          resp_total: 111,
          children: [{}, {}]
        });
        return assertRenderedCorrectly(this.view, "111 responses", "Showing first 2 responses", "Load next 100 responses");
      });
      return describe("on clicking the load more button", function() {
        beforeEach(function() {
          renderWithContent(this.view, {
            resp_total: 5,
            children: [{}]
          });
          return assertRenderedCorrectly(this.view, "5 responses", "Showing first response", "Load all responses");
        });
        it("correctly re-render when all threads have loaded", function() {
          DiscussionViewSpecHelper.setNextResponseContent({
            resp_total: 5,
            children: [{}, {}, {}, {}]
          });
          this.view.$el.find(".load-response-button").click();
          return assertRenderedCorrectly(this.view, "5 responses", "Showing all responses", null);
        });
        it("correctly re-render when one page remains", function() {
          DiscussionViewSpecHelper.setNextResponseContent({
            resp_total: 42,
            children: [{}, {}]
          });
          this.view.$el.find(".load-response-button").click();
          return assertRenderedCorrectly(this.view, "42 responses", "Showing first 3 responses", "Load all responses");
        });
        return it("correctly re-render when multiple pages remain", function() {
          DiscussionViewSpecHelper.setNextResponseContent({
            resp_total: 111,
            children: [{}, {}]
          });
          this.view.$el.find(".load-response-button").click();
          return assertRenderedCorrectly(this.view, "111 responses", "Showing first 3 responses", "Load next 100 responses");
        });
      });
    });
  });

}).call(this);
