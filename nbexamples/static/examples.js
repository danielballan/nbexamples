// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

define([
    'base/js/namespace',
    'jquery',
    'base/js/utils',
    'base/js/dialog',
], function(Jupyter, $, utils, dialog) {
    "use strict";

    var Examples = function (reviewed_selector, fetched_selector, unreviewed_selector, options) {
        this.reviewed_selector = reviewed_selector;
        this.fetched_selector = fetched_selector;
        this.unreviewed_selector = unreviewed_selector;

        this.reviewed_element = $(reviewed_selector);
        this.fetched_element = $(fetched_selector);
        this.unreviewed_element = $(unreviewed_selector);
        this.bind_events();

        options = options || {};
        this.options = options;
        this.base_url = options.base_url || utils.get_body_data("baseUrl");
    };


    Examples.prototype.bind_events = function () {
        var that = this;
        $('#refresh_examples_list').click(function () {
            that.load_list();
        });
    };


    Examples.prototype.load_list = function () {
        var settings = {
            processData : false,
            cache : false,
            type : "GET",
            dataType : "json",
            success : $.proxy(this.load_list_success, this),
            error : utils.log_ajax_error,
        };
        var url = utils.url_join_encode(this.base_url, 'examples');
        $.ajax(url, settings);
    };


    Examples.prototype.clear_list = function () {
        // remove list items
        this.reviewed_element.children('.list_item').remove();
        this.fetched_element.children('.list_item').remove();
        this.unreviewed_element.children('.list_item').remove();

        // show placeholders
        this.reviewed_element.children('.list_placeholder').show();
        this.fetched_element.children('.list_placeholder').show();
        this.unreviewed_element.children('.list_placeholder').show();
    };

    Examples.prototype.load_list_success = function (data, status, xhr) {
        this.clear_list();
        var len = data.length;
        for (var i=0; i<len; i++) {
            var element = $('<div/>');
            var item = new Example(element, data[i], $.proxy(this.load_list_success, this), this.options);
            this.reviewed_element.append(element);
            if (data[i]['status'] === 'reviewed') {
                this.reviewed_element.children('.list_placeholder').hide();
            } else if (data[i]['status'] === 'fetched') {
                this.fetched_element.append(element);
                this.fetched_element.children('.list_placeholder').hide();
            } else if (data[i]['status'] === 'unreviewed') {
                this.unreviewed_element.append(element);
                this.unreviewed_element.children('.list_placeholder').hide();
            }
        }

        // Add collapse arrows.
        $('.example-notebooks-link').each(function(index, el) {
            var $link = $(el);
            var $icon = $('<i />')
                .addClass('fa fa-caret-down')
                .css('transform', 'rotate(-90deg)')
                .css('borderSpacing', '90')
                .css('margin-left', '3px');
            $link.append($icon);
            $link.down = false;
            $link.click(function () {
                if ($link.down) {
                    $link.down = false;
                    // jQeury doesn't know how to animate rotations.  Abuse
                    // jQueries animate function by using an unused css attribute
                    // to do the animation (borderSpacing).
                    $icon.animate({ borderSpacing: 90 }, {
                        step: function(now,fx) {
                            $icon.css('transform','rotate(-' + now + 'deg)'); 
                        }
                    }, 250);
                } else {
                    $link.down = true;
                    // See comment above.
                    $icon.animate({ borderSpacing: 0 }, {
                        step: function(now,fx) {
                            $icon.css('transform','rotate(-' + now + 'deg)'); 
                        }
                    }, 250);
                }
            });
        });
    };


    var Example = function (element, data, on_refresh, options) {
        this.element = $(element);
        this.data = data;
        this.on_refresh = on_refresh;
        this.options = options;
        this.base_url = options.base_url || utils.get_body_data("baseUrl");
        this.style();
        this.make_row();
    };

    Example.prototype.style = function () {
        this.element.addClass('list_item').addClass("row");
    };

    Example.prototype.escape_id = function () {
        // construct the id from the course id and the example id, and also
        // prepend the id with "nbgrader" (this also ensures that the first
        // character is always a letter, as required by HTML 4)
        var id = "nbgrader-" + this.data.course_id + "-" + this.data.example_id;

        // replace spaces with '_'
        id = id.replace(/ /g, "_");

        // remove any characters that are invalid in HTML div ids
        id = id.replace(/[^A-Za-z0-9\-_]/g, "");

        return id;
    };

    Example.prototype.make_row = function () {
        var row = $('<div/>').addClass('col-md-12');
        row.append(this.make_link());
        row.append($('<span/>').addClass('item_course col-sm-2').text(this.data.metadata.title));
        row.append($('<a/>').attr("href", "examples/preview?example_id=" + this.data.filepath).addClass("btn btn-primary btn-xs").text('Preview'));
        if (this.data.status === 'unreviewed') {
            row.append($('<span/>').addClass('item_status col-sm-4').text(this.data.timestamp));
        } else {
            row.append(this.make_button());
        }
        this.element.empty().append(row);

        if (this.data.status === 'fetched') {
            var id = this.escape_id();
            var children = $('<div/>')
                .attr("id", id)
                .addClass("panel-collapse collapse list_container example-notebooks")
                .attr("role", "tabpanel");

            var element, child;
            children.append($('<div/>').addClass('list_item row'));
            for (var i=0; i<this.data.notebooks.length; i++) {
                element = $('<div/>');
                this.data.notebooks[i].course_id = this.data.course_id;
                this.data.notebooks[i].example_id = this.data.example_id;
                child = new Notebook(element, this.data.notebooks[i], this.options);
                children.append(element);
            }

            this.element.append(children);
        }
    };

    Example.prototype.make_link = function () {
        var container = $('<span/>').addClass('item_name col-sm-6');
        var link;

        if (this.data.status === 'fetched') {
            var id = this.escape_id();
            link = $('<a/>')
                .addClass("collapsed example-notebooks-link")
                .attr("role", "button")
                .attr("data-toggle", "collapse")
                .attr("data-parent", "#fetched_examples_list")
                .attr("href", "#" + id)
                .attr("aria-expanded", "false")
                .attr("aria-controls", id)
        } else {
            link = $('<span/>');
        }

        link.text(this.data.example_id);
        container.append(link);
        return container;
    };

    Example.prototype.make_button = function () {
        var that = this;
        var container = $('<span/>').addClass('item_status col-sm-4');
        var button = $('<button/>').addClass("btn btn-primary btn-xs");
        container.append(button);

        if (this.data.status == 'reviewed') {
            button.text("Fetch");
            button.click(function (e) {
                var settings = {
                    cache : false,
                    data : {
                        course_id: that.data.course_id,
                        example_id: that.data.example_id
                    },
                    type : "POST",
                    dataType : "json",
                    success : $.proxy(that.on_refresh, that),
                    error : function (xhr, status, error) {
                        container.empty().text("Error fetching example.");
                        utils.log_ajax_error(xhr, status, error);
                    }
                };
                button.text('Fetching...');
                button.attr('disabled', 'disabled');
                var url = utils.url_join_encode(
                    that.base_url,
                    'examples',
                    'fetch'
                );
                $.ajax(url, settings);
            });

        } else if (this.data.status == 'fetched') {
            button.text("Submit");
            button.click(function (e) {
                var settings = {
                    cache : false,
                    data : {
                        course_id: that.data.course_id,
                        example_id: that.data.example_id
                    },
                    type : "POST",
                    dataType : "json",
                    success : $.proxy(that.on_refresh, that),
                    error : function (xhr, status, error) {
                        container.empty().text("Error submitting example.");
                        utils.log_ajax_error(xhr, status, error);
                    }
                };
                button.text('Submitting...');
                button.attr('disabled', 'disabled');
                var url = utils.url_join_encode(
                    that.base_url,
                    'examples',
                    'submit'
                );
                $.ajax(url, settings);
            });
        }

        return container;
    };

    var Notebook = function (element, data, options) {
        this.element = $(element);
        this.data = data;
        this.options = options;
        this.base_url = options.base_url || utils.get_body_data("baseUrl");
        this.style();
        this.make_row();
    };

    Notebook.prototype.style = function () {
        this.element.addClass('list_item').addClass("row");
    };

    Notebook.prototype.make_row = function () {
        var container = $('<div/>').addClass('col-md-12');
        var url = utils.url_join_encode(this.base_url, 'tree', this.data.example_id, this.data.notebook_id) + ".ipynb";
        var link = $('<span/>').addClass('item_name col-sm-6').append(
            $('<a/>')
                .attr("href", url)
                .attr("target", "_blank")
                .text(this.data.notebook_id));
        container.append(link);
        container.append($('<span/>').addClass('item_course col-sm-2'));
        container.append(this.make_button());
        this.element.append(container);
    };

    Notebook.prototype.make_button = function () {
        var that = this;
        var container = $('<span/>').addClass('item_status col-sm-4');
        var button = $('<button/>').addClass("btn btn-default btn-xs");
        container.append(button);

        button.text("Validate");
        button.click(function (e) {
            var settings = {
                cache : false,
                data : {
                    course_id: that.data.course_id,
                    example_id: that.data.example_id,
                    notebook_id: that.data.notebook_id
                },
                type : "POST",
                dataType : "json",
                success : function (data, status, xhr) {
                    button.text('Validate');
                    button.removeAttr('disabled');
                    that.validate(data, button);
                },
                error : function (xhr, status, error) {
                    container.empty().text("Error validating example.");
                    utils.log_ajax_error(xhr, status, error);
                }
            };
            button.text('Validating...');
            button.attr('disabled', 'disabled');
            var url = utils.url_join_encode(
                that.base_url,
                'examples',
                'validate'
            );
            $.ajax(url, settings);
        });

        return container;
    };

    Notebook.prototype.validate_success = function (button) {
        button
            .removeClass("btn-default")
            .removeClass("btn-danger")
            .removeClass("btn-success")
            .addClass("btn-success");
    };

    Notebook.prototype.validate_failure = function (button) {
        button
            .removeClass("btn-default")
            .removeClass("btn-danger")
            .removeClass("btn-success")
            .addClass("btn-danger");
    };

    Notebook.prototype.validate = function (data, button) {
        data = JSON.parse(data);
        var body = $('<div/>').attr("id", "validation-message");
        if (data.changed !== undefined) {
            for (var i=0; i<data.changed.length; i++) {
                body.append($('<div/>').append($('<p/>').text('The source of the following cell has changed, but it should not have!')));
                body.append($('<pre/>').text(data.changed[i].source));
            }
            body.addClass("validation-changed");
            this.validate_failure(button);

        } else if (data.passed !== undefined) {
            for (var i=0; i<data.changed.length; i++) {
                body.append($('<div/>').append($('<p/>').text('The following cell passed:')));
                body.append($('<pre/>').text(data.passed[i].source));
            }
            body.addClass("validation-passed");
            this.validate_failure(button);

        } else if (data.failed !== undefined) {
            for (var i=0; i<data.failed.length; i++) {
                body.append($('<div/>').append($('<p/>').text('The following cell failed:')));
                body.append($('<pre/>').text(data.failed[i].source));
                body.append($('<pre/>').html(data.failed[i].error));
            }
            body.addClass("validation-failed");
            this.validate_failure(button);

        } else {
            body.append($('<div/>').append($('<p/>').text('Success! Your notebook passes all the tests.')));
            body.addClass("validation-success");
            this.validate_success(button);
        }

        dialog.modal({
            title: "Validation Results",
            body: body,
            buttons: { OK: { class : "btn-primary" } }
        });
    };

    return {
        'Examples': Examples,
        'Example': Example,
        'Notebook': Notebook
    };
});
