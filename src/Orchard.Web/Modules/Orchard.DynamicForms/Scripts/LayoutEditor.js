angular
    .module("LayoutEditor")
    .directive("orcLayoutFieldset", ["$compile", "scopeConfigurator", "environment",
        function ($compile, scopeConfigurator, environment) {
            return {
                restrict: "E",
                scope: { element: "=" },
                controller: ["$scope", "$element",
                    function ($scope, $element) {
                        scopeConfigurator.configureForElement($scope, $element);
                        scopeConfigurator.configureForContainer($scope, $element);
                        $scope.sortableOptions["axis"] = "y";
                        $scope.edit = function () {
                            $scope.$root.editElement($scope.element).then(function (args) {
                                if (args.cancel)
                                    return;
                                $scope.$apply(function() {
                                    $scope.element.data = decodeURIComponent(args.element.data);
                                    $scope.element.applyElementEditorModel(args.elementEditorModel);
                                });
                            });
                        };
                    }
                ],
                templateUrl: environment.templateUrl("Fieldset"),
                replace: true
            };
        }
    ]);
angular
    .module("LayoutEditor")
    .directive("orcLayoutForm", ["$compile", "scopeConfigurator", "environment",
        function ($compile, scopeConfigurator, environment) {
            return {
                restrict: "E",
                scope: { element: "=" },
                controller: ["$scope", "$element",
                    function ($scope, $element) {
                        scopeConfigurator.configureForElement($scope, $element);
                        scopeConfigurator.configureForContainer($scope, $element);
                        $scope.sortableOptions["axis"] = "y";
                        $scope.edit = function () {
                            $scope.$root.editElement($scope.element).then(function (args) {
                                if (args.cancel)
                                    return;

                                $scope.$apply(function() {
                                    $scope.element.data = decodeURIComponent(args.element.data);
                                    $scope.element.applyElementEditorModel(args.elementEditorModel);
                                });
                            });
                        };
                    }
                ],
                templateUrl: environment.templateUrl("Form"),
                replace: true
            };
        }
    ]);
var LayoutEditor;
(function ($, LayoutEditor) {

    LayoutEditor.Fieldset = function (data, htmlId, htmlClass, htmlStyle, isTemplated, legend, contentType, contentTypeLabel, contentTypeClass, hasEditor, children) {
        LayoutEditor.Element.call(this, "Fieldset", data, htmlId, htmlClass, htmlStyle, isTemplated);
        LayoutEditor.Container.call(this, ["Grid", "Content"], children);

        var self = this;
        this.isContainable = true;
        this.dropTargetClass = "layout-common-holder";
        this.contentType = contentType;
        this.contentTypeLabel = contentTypeLabel;
        this.contentTypeClass = contentTypeClass;
        this.legend = legend || "";
        this.hasEditor = hasEditor;

        this.toObject = function () {
            var result = this.elementToObject();
            result.legend = this.legend;
            result.children = this.childrenToObject();

            return result;
        };

        var getEditorObject = this.getEditorObject;
        this.getEditorObject = function() {
            var dto = getEditorObject();
            return $.extend(dto, {
                Legend: this.legend
            });
        }

        this.setChildren = function (children) {
            this.children = children;
            _(this.children).each(function (child) {
                child.parent = self;
            });
        };

        this.applyElementEditorModel = function(model) {
            this.legend = model.legend;
        };

        this.setChildren(children);
    };

    LayoutEditor.Fieldset.from = function (value) {
        return new LayoutEditor.Fieldset(
            value.data,
            value.htmlId,
            value.htmlClass,
            value.htmlStyle,
            value.isTemplated,
            value.legend,
            value.contentType,
            value.contentTypeLabel,
            value.contentTypeClass,
            value.hasEditor,
            LayoutEditor.childrenFrom(value.children));
    };

    LayoutEditor.registerFactory("Fieldset", function(value) {
        return LayoutEditor.Fieldset.from(value);
    });

})(jQuery, LayoutEditor || (LayoutEditor = {}));

var LayoutEditor;
(function ($, LayoutEditor) {

    LayoutEditor.Form = function (data, htmlId, htmlClass, htmlStyle, isTemplated, name, formBindingContentType, contentType, contentTypeLabel, contentTypeClass, hasEditor, rule, children) {
        LayoutEditor.Element.call(this, "Form", data, htmlId, htmlClass, htmlStyle, isTemplated, rule);
        LayoutEditor.Container.call(this, ["Grid", "Content"], children);

        var self = this;
        this.isContainable = true;
        this.dropTargetClass = "layout-common-holder";
        this.contentType = contentType;
        this.contentTypeLabel = contentTypeLabel;
        this.contentTypeClass = contentTypeClass;
        this.name = name || "Untitled";
        this.formBindingContentType = formBindingContentType;
        this.hasEditor = hasEditor;

        this.toObject = function () {
            var result = this.elementToObject();
            result.name = this.name;
            result.formBindingContentType = this.formBindingContentType;
            result.children = this.childrenToObject();

            return result;
        };

        var getEditorObject = this.getEditorObject;
        this.getEditorObject = function() {
            var dto = getEditorObject();
            return $.extend(dto, {
                FormName: this.name,
                FormBindingContentType: this.formBindingContentType
            });
        }

        this.allowSealedFocus = function () {
            return this.children.length === 0;
        };

        this.setChildren = function (children) {
            this.children = children;
            _(this.children).each(function (child) {
                child.setParent(self);
            });
        };

        this.onDescendantAdded = function(element) {
            var getEditorObject = element.getEditorObject;
            element.getEditorObject = function () {
                var dto = getEditorObject();
                return $.extend(dto, {
                    FormBindingContentType: self.formBindingContentType
                });
            };
        };

        this.applyElementEditorModel = function(model) {
            this.name = model.name;
            this.formBindingContentType = model.formBindingContentType;
        };

        this.setChildren(children);
    };

    LayoutEditor.Form.from = function (value) {
        return new LayoutEditor.Form(
            value.data,
            value.htmlId,
            value.htmlClass,
            value.htmlStyle,
            value.isTemplated,
            value.name,
            value.formBindingContentType,
            value.contentType,
            value.contentTypeLabel,
            value.contentTypeClass,
            value.hasEditor,
            value.rule,
            LayoutEditor.childrenFrom(value.children));
    };

    LayoutEditor.registerFactory("Form", function(value) { return LayoutEditor.Form.from(value); });

})(jQuery, LayoutEditor || (LayoutEditor = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkRpcmVjdGl2ZXMvRmllbGRzZXQuanMiLCJEaXJlY3RpdmVzL0Zvcm0uanMiLCJNb2RlbHMvRmllbGRzZXQuanMiLCJNb2RlbHMvRm9ybS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiTGF5b3V0RWRpdG9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiYW5ndWxhclxyXG4gICAgLm1vZHVsZShcIkxheW91dEVkaXRvclwiKVxyXG4gICAgLmRpcmVjdGl2ZShcIm9yY0xheW91dEZpZWxkc2V0XCIsIFtcIiRjb21waWxlXCIsIFwic2NvcGVDb25maWd1cmF0b3JcIiwgXCJlbnZpcm9ubWVudFwiLFxyXG4gICAgICAgIGZ1bmN0aW9uICgkY29tcGlsZSwgc2NvcGVDb25maWd1cmF0b3IsIGVudmlyb25tZW50KSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICByZXN0cmljdDogXCJFXCIsXHJcbiAgICAgICAgICAgICAgICBzY29wZTogeyBlbGVtZW50OiBcIj1cIiB9LFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogW1wiJHNjb3BlXCIsIFwiJGVsZW1lbnRcIixcclxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoJHNjb3BlLCAkZWxlbWVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzY29wZUNvbmZpZ3VyYXRvci5jb25maWd1cmVGb3JFbGVtZW50KCRzY29wZSwgJGVsZW1lbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzY29wZUNvbmZpZ3VyYXRvci5jb25maWd1cmVGb3JDb250YWluZXIoJHNjb3BlLCAkZWxlbWVudCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5zb3J0YWJsZU9wdGlvbnNbXCJheGlzXCJdID0gXCJ5XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5lZGl0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLiRyb290LmVkaXRFbGVtZW50KCRzY29wZS5lbGVtZW50KS50aGVuKGZ1bmN0aW9uIChhcmdzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFyZ3MuY2FuY2VsKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLiRhcHBseShmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmVsZW1lbnQuZGF0YSA9IGRlY29kZVVSSUNvbXBvbmVudChhcmdzLmVsZW1lbnQuZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5lbGVtZW50LmFwcGx5RWxlbWVudEVkaXRvck1vZGVsKGFyZ3MuZWxlbWVudEVkaXRvck1vZGVsKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogZW52aXJvbm1lbnQudGVtcGxhdGVVcmwoXCJGaWVsZHNldFwiKSxcclxuICAgICAgICAgICAgICAgIHJlcGxhY2U6IHRydWVcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICBdKTsiLCJhbmd1bGFyXHJcbiAgICAubW9kdWxlKFwiTGF5b3V0RWRpdG9yXCIpXHJcbiAgICAuZGlyZWN0aXZlKFwib3JjTGF5b3V0Rm9ybVwiLCBbXCIkY29tcGlsZVwiLCBcInNjb3BlQ29uZmlndXJhdG9yXCIsIFwiZW52aXJvbm1lbnRcIixcclxuICAgICAgICBmdW5jdGlvbiAoJGNvbXBpbGUsIHNjb3BlQ29uZmlndXJhdG9yLCBlbnZpcm9ubWVudCkge1xyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgcmVzdHJpY3Q6IFwiRVwiLFxyXG4gICAgICAgICAgICAgICAgc2NvcGU6IHsgZWxlbWVudDogXCI9XCIgfSxcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6IFtcIiRzY29wZVwiLCBcIiRlbGVtZW50XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKCRzY29wZSwgJGVsZW1lbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGVDb25maWd1cmF0b3IuY29uZmlndXJlRm9yRWxlbWVudCgkc2NvcGUsICRlbGVtZW50KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGVDb25maWd1cmF0b3IuY29uZmlndXJlRm9yQ29udGFpbmVyKCRzY29wZSwgJGVsZW1lbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuc29ydGFibGVPcHRpb25zW1wiYXhpc1wiXSA9IFwieVwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZWRpdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS4kcm9vdC5lZGl0RWxlbWVudCgkc2NvcGUuZWxlbWVudCkudGhlbihmdW5jdGlvbiAoYXJncykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhcmdzLmNhbmNlbClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuJGFwcGx5KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZWxlbWVudC5kYXRhID0gZGVjb2RlVVJJQ29tcG9uZW50KGFyZ3MuZWxlbWVudC5kYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmVsZW1lbnQuYXBwbHlFbGVtZW50RWRpdG9yTW9kZWwoYXJncy5lbGVtZW50RWRpdG9yTW9kZWwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBlbnZpcm9ubWVudC50ZW1wbGF0ZVVybChcIkZvcm1cIiksXHJcbiAgICAgICAgICAgICAgICByZXBsYWNlOiB0cnVlXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgXSk7IiwidmFyIExheW91dEVkaXRvcjtcclxuKGZ1bmN0aW9uICgkLCBMYXlvdXRFZGl0b3IpIHtcclxuXHJcbiAgICBMYXlvdXRFZGl0b3IuRmllbGRzZXQgPSBmdW5jdGlvbiAoZGF0YSwgaHRtbElkLCBodG1sQ2xhc3MsIGh0bWxTdHlsZSwgaXNUZW1wbGF0ZWQsIGxlZ2VuZCwgY29udGVudFR5cGUsIGNvbnRlbnRUeXBlTGFiZWwsIGNvbnRlbnRUeXBlQ2xhc3MsIGhhc0VkaXRvciwgY2hpbGRyZW4pIHtcclxuICAgICAgICBMYXlvdXRFZGl0b3IuRWxlbWVudC5jYWxsKHRoaXMsIFwiRmllbGRzZXRcIiwgZGF0YSwgaHRtbElkLCBodG1sQ2xhc3MsIGh0bWxTdHlsZSwgaXNUZW1wbGF0ZWQpO1xyXG4gICAgICAgIExheW91dEVkaXRvci5Db250YWluZXIuY2FsbCh0aGlzLCBbXCJHcmlkXCIsIFwiQ29udGVudFwiXSwgY2hpbGRyZW4pO1xyXG5cclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5pc0NvbnRhaW5hYmxlID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLmRyb3BUYXJnZXRDbGFzcyA9IFwibGF5b3V0LWNvbW1vbi1ob2xkZXJcIjtcclxuICAgICAgICB0aGlzLmNvbnRlbnRUeXBlID0gY29udGVudFR5cGU7XHJcbiAgICAgICAgdGhpcy5jb250ZW50VHlwZUxhYmVsID0gY29udGVudFR5cGVMYWJlbDtcclxuICAgICAgICB0aGlzLmNvbnRlbnRUeXBlQ2xhc3MgPSBjb250ZW50VHlwZUNsYXNzO1xyXG4gICAgICAgIHRoaXMubGVnZW5kID0gbGVnZW5kIHx8IFwiXCI7XHJcbiAgICAgICAgdGhpcy5oYXNFZGl0b3IgPSBoYXNFZGl0b3I7XHJcblxyXG4gICAgICAgIHRoaXMudG9PYmplY3QgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSB0aGlzLmVsZW1lbnRUb09iamVjdCgpO1xyXG4gICAgICAgICAgICByZXN1bHQubGVnZW5kID0gdGhpcy5sZWdlbmQ7XHJcbiAgICAgICAgICAgIHJlc3VsdC5jaGlsZHJlbiA9IHRoaXMuY2hpbGRyZW5Ub09iamVjdCgpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB2YXIgZ2V0RWRpdG9yT2JqZWN0ID0gdGhpcy5nZXRFZGl0b3JPYmplY3Q7XHJcbiAgICAgICAgdGhpcy5nZXRFZGl0b3JPYmplY3QgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyIGR0byA9IGdldEVkaXRvck9iamVjdCgpO1xyXG4gICAgICAgICAgICByZXR1cm4gJC5leHRlbmQoZHRvLCB7XHJcbiAgICAgICAgICAgICAgICBMZWdlbmQ6IHRoaXMubGVnZW5kXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5zZXRDaGlsZHJlbiA9IGZ1bmN0aW9uIChjaGlsZHJlbikge1xyXG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuID0gY2hpbGRyZW47XHJcbiAgICAgICAgICAgIF8odGhpcy5jaGlsZHJlbikuZWFjaChmdW5jdGlvbiAoY2hpbGQpIHtcclxuICAgICAgICAgICAgICAgIGNoaWxkLnBhcmVudCA9IHNlbGY7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuYXBwbHlFbGVtZW50RWRpdG9yTW9kZWwgPSBmdW5jdGlvbihtb2RlbCkge1xyXG4gICAgICAgICAgICB0aGlzLmxlZ2VuZCA9IG1vZGVsLmxlZ2VuZDtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLnNldENoaWxkcmVuKGNoaWxkcmVuKTtcclxuICAgIH07XHJcblxyXG4gICAgTGF5b3V0RWRpdG9yLkZpZWxkc2V0LmZyb20gPSBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICByZXR1cm4gbmV3IExheW91dEVkaXRvci5GaWVsZHNldChcclxuICAgICAgICAgICAgdmFsdWUuZGF0YSxcclxuICAgICAgICAgICAgdmFsdWUuaHRtbElkLFxyXG4gICAgICAgICAgICB2YWx1ZS5odG1sQ2xhc3MsXHJcbiAgICAgICAgICAgIHZhbHVlLmh0bWxTdHlsZSxcclxuICAgICAgICAgICAgdmFsdWUuaXNUZW1wbGF0ZWQsXHJcbiAgICAgICAgICAgIHZhbHVlLmxlZ2VuZCxcclxuICAgICAgICAgICAgdmFsdWUuY29udGVudFR5cGUsXHJcbiAgICAgICAgICAgIHZhbHVlLmNvbnRlbnRUeXBlTGFiZWwsXHJcbiAgICAgICAgICAgIHZhbHVlLmNvbnRlbnRUeXBlQ2xhc3MsXHJcbiAgICAgICAgICAgIHZhbHVlLmhhc0VkaXRvcixcclxuICAgICAgICAgICAgTGF5b3V0RWRpdG9yLmNoaWxkcmVuRnJvbSh2YWx1ZS5jaGlsZHJlbikpO1xyXG4gICAgfTtcclxuXHJcbiAgICBMYXlvdXRFZGl0b3IucmVnaXN0ZXJGYWN0b3J5KFwiRmllbGRzZXRcIiwgZnVuY3Rpb24odmFsdWUpIHtcclxuICAgICAgICByZXR1cm4gTGF5b3V0RWRpdG9yLkZpZWxkc2V0LmZyb20odmFsdWUpO1xyXG4gICAgfSk7XHJcblxyXG59KShqUXVlcnksIExheW91dEVkaXRvciB8fCAoTGF5b3V0RWRpdG9yID0ge30pKTtcclxuIiwidmFyIExheW91dEVkaXRvcjtcclxuKGZ1bmN0aW9uICgkLCBMYXlvdXRFZGl0b3IpIHtcclxuXHJcbiAgICBMYXlvdXRFZGl0b3IuRm9ybSA9IGZ1bmN0aW9uIChkYXRhLCBodG1sSWQsIGh0bWxDbGFzcywgaHRtbFN0eWxlLCBpc1RlbXBsYXRlZCwgbmFtZSwgZm9ybUJpbmRpbmdDb250ZW50VHlwZSwgY29udGVudFR5cGUsIGNvbnRlbnRUeXBlTGFiZWwsIGNvbnRlbnRUeXBlQ2xhc3MsIGhhc0VkaXRvciwgcnVsZSwgY2hpbGRyZW4pIHtcclxuICAgICAgICBMYXlvdXRFZGl0b3IuRWxlbWVudC5jYWxsKHRoaXMsIFwiRm9ybVwiLCBkYXRhLCBodG1sSWQsIGh0bWxDbGFzcywgaHRtbFN0eWxlLCBpc1RlbXBsYXRlZCwgcnVsZSk7XHJcbiAgICAgICAgTGF5b3V0RWRpdG9yLkNvbnRhaW5lci5jYWxsKHRoaXMsIFtcIkdyaWRcIiwgXCJDb250ZW50XCJdLCBjaGlsZHJlbik7XHJcblxyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB0aGlzLmlzQ29udGFpbmFibGUgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuZHJvcFRhcmdldENsYXNzID0gXCJsYXlvdXQtY29tbW9uLWhvbGRlclwiO1xyXG4gICAgICAgIHRoaXMuY29udGVudFR5cGUgPSBjb250ZW50VHlwZTtcclxuICAgICAgICB0aGlzLmNvbnRlbnRUeXBlTGFiZWwgPSBjb250ZW50VHlwZUxhYmVsO1xyXG4gICAgICAgIHRoaXMuY29udGVudFR5cGVDbGFzcyA9IGNvbnRlbnRUeXBlQ2xhc3M7XHJcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZSB8fCBcIlVudGl0bGVkXCI7XHJcbiAgICAgICAgdGhpcy5mb3JtQmluZGluZ0NvbnRlbnRUeXBlID0gZm9ybUJpbmRpbmdDb250ZW50VHlwZTtcclxuICAgICAgICB0aGlzLmhhc0VkaXRvciA9IGhhc0VkaXRvcjtcclxuXHJcbiAgICAgICAgdGhpcy50b09iamVjdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IHRoaXMuZWxlbWVudFRvT2JqZWN0KCk7XHJcbiAgICAgICAgICAgIHJlc3VsdC5uYW1lID0gdGhpcy5uYW1lO1xyXG4gICAgICAgICAgICByZXN1bHQuZm9ybUJpbmRpbmdDb250ZW50VHlwZSA9IHRoaXMuZm9ybUJpbmRpbmdDb250ZW50VHlwZTtcclxuICAgICAgICAgICAgcmVzdWx0LmNoaWxkcmVuID0gdGhpcy5jaGlsZHJlblRvT2JqZWN0KCk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHZhciBnZXRFZGl0b3JPYmplY3QgPSB0aGlzLmdldEVkaXRvck9iamVjdDtcclxuICAgICAgICB0aGlzLmdldEVkaXRvck9iamVjdCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB2YXIgZHRvID0gZ2V0RWRpdG9yT2JqZWN0KCk7XHJcbiAgICAgICAgICAgIHJldHVybiAkLmV4dGVuZChkdG8sIHtcclxuICAgICAgICAgICAgICAgIEZvcm1OYW1lOiB0aGlzLm5hbWUsXHJcbiAgICAgICAgICAgICAgICBGb3JtQmluZGluZ0NvbnRlbnRUeXBlOiB0aGlzLmZvcm1CaW5kaW5nQ29udGVudFR5cGVcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmFsbG93U2VhbGVkRm9jdXMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNoaWxkcmVuLmxlbmd0aCA9PT0gMDtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLnNldENoaWxkcmVuID0gZnVuY3Rpb24gKGNoaWxkcmVuKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW4gPSBjaGlsZHJlbjtcclxuICAgICAgICAgICAgXyh0aGlzLmNoaWxkcmVuKS5lYWNoKGZ1bmN0aW9uIChjaGlsZCkge1xyXG4gICAgICAgICAgICAgICAgY2hpbGQuc2V0UGFyZW50KHNlbGYpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLm9uRGVzY2VuZGFudEFkZGVkID0gZnVuY3Rpb24oZWxlbWVudCkge1xyXG4gICAgICAgICAgICB2YXIgZ2V0RWRpdG9yT2JqZWN0ID0gZWxlbWVudC5nZXRFZGl0b3JPYmplY3Q7XHJcbiAgICAgICAgICAgIGVsZW1lbnQuZ2V0RWRpdG9yT2JqZWN0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGR0byA9IGdldEVkaXRvck9iamVjdCgpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICQuZXh0ZW5kKGR0bywge1xyXG4gICAgICAgICAgICAgICAgICAgIEZvcm1CaW5kaW5nQ29udGVudFR5cGU6IHNlbGYuZm9ybUJpbmRpbmdDb250ZW50VHlwZVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5hcHBseUVsZW1lbnRFZGl0b3JNb2RlbCA9IGZ1bmN0aW9uKG1vZGVsKSB7XHJcbiAgICAgICAgICAgIHRoaXMubmFtZSA9IG1vZGVsLm5hbWU7XHJcbiAgICAgICAgICAgIHRoaXMuZm9ybUJpbmRpbmdDb250ZW50VHlwZSA9IG1vZGVsLmZvcm1CaW5kaW5nQ29udGVudFR5cGU7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRDaGlsZHJlbihjaGlsZHJlbik7XHJcbiAgICB9O1xyXG5cclxuICAgIExheW91dEVkaXRvci5Gb3JtLmZyb20gPSBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICByZXR1cm4gbmV3IExheW91dEVkaXRvci5Gb3JtKFxyXG4gICAgICAgICAgICB2YWx1ZS5kYXRhLFxyXG4gICAgICAgICAgICB2YWx1ZS5odG1sSWQsXHJcbiAgICAgICAgICAgIHZhbHVlLmh0bWxDbGFzcyxcclxuICAgICAgICAgICAgdmFsdWUuaHRtbFN0eWxlLFxyXG4gICAgICAgICAgICB2YWx1ZS5pc1RlbXBsYXRlZCxcclxuICAgICAgICAgICAgdmFsdWUubmFtZSxcclxuICAgICAgICAgICAgdmFsdWUuZm9ybUJpbmRpbmdDb250ZW50VHlwZSxcclxuICAgICAgICAgICAgdmFsdWUuY29udGVudFR5cGUsXHJcbiAgICAgICAgICAgIHZhbHVlLmNvbnRlbnRUeXBlTGFiZWwsXHJcbiAgICAgICAgICAgIHZhbHVlLmNvbnRlbnRUeXBlQ2xhc3MsXHJcbiAgICAgICAgICAgIHZhbHVlLmhhc0VkaXRvcixcclxuICAgICAgICAgICAgdmFsdWUucnVsZSxcclxuICAgICAgICAgICAgTGF5b3V0RWRpdG9yLmNoaWxkcmVuRnJvbSh2YWx1ZS5jaGlsZHJlbikpO1xyXG4gICAgfTtcclxuXHJcbiAgICBMYXlvdXRFZGl0b3IucmVnaXN0ZXJGYWN0b3J5KFwiRm9ybVwiLCBmdW5jdGlvbih2YWx1ZSkgeyByZXR1cm4gTGF5b3V0RWRpdG9yLkZvcm0uZnJvbSh2YWx1ZSk7IH0pO1xyXG5cclxufSkoalF1ZXJ5LCBMYXlvdXRFZGl0b3IgfHwgKExheW91dEVkaXRvciA9IHt9KSk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9