// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

define([
    'base/js/namespace',
    'jquery',
    'base/js/utils',
    'base/js/dialog',
], function(Jupyter, $, utils, dialog) {
    "use strict";

    var Examples = function (reviewed_selector, unreviewed_selector, options) {
        this.reviewed_selector = reviewed_selector;
        this.unreviewed_selector = unreviewed_selector;

        this.reviewed_element = $(reviewed_selector);
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

        // Watch for any modal dialog submission and hide the dialog
        // when it occurs. The data-dismiss attribute form of this
        // behavior prevents the form submission.
        [this.reviewed_element, this.unreviewed_element].forEach(function(element) {
            element.on('submit', '.modal-dialog form', function(evt) {
                $(evt.target).closest('.modal').modal('hide');
            });
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
        this.unreviewed_element.children('.list_item').remove();

        // show placeholders
        this.reviewed_element.children('.list_placeholder').show();
        this.unreviewed_element.children('.list_placeholder').show();
    };

    Examples.prototype.load_list_success = function (data, status, xhr) {
        this.clear_list();
        var len = data.length;
        for (var i=0; i<len; i++) {
            var element = $('<div/>');
            var item = new Example(element,
                data[i],
                this.options
            );
            this.reviewed_element.append(element);
            if (data[i]['category'] === 'reviewed') {
                this.reviewed_element.children('.list_placeholder').hide();
            } else if (data[i]['category'] === 'unreviewed') {
                this.unreviewed_element.append(element);
                this.unreviewed_element.children('.list_placeholder').hide();
            }
        }
    };

    var Example = function (element, data, options) {
        this.element = $(element);
        this.data = data;
        this.options = options;
        this.base_url = options.base_url || utils.get_body_data("baseUrl");
        this.style();
        this.make_row();
    };

    Example.prototype.style = function () {
        this.element.addClass('list_item').addClass("row");
    };

    Example.prototype.hash = function(s){
        return s.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);
    }

    Example.prototype.make_row = function () {
        var row = $('<div/>').addClass('col-md-12');
        var display_title = this.data.metadata.title || this.data.filepath
        row.append($('<span/>').addClass('item_name').text(display_title));
        row.append($('<span/>')
            .addClass('item_summary')
            .text(this.data.metadata.summary));
        var btns = $('<div/>').addClass('item-buttons pull-right');
        if (this.data.owned & (this.data.category == 'unreviewed')) {
            btns.append($('<a/>')
                .attr("href", utils.url_join_encode(this.base_url, "examples/delete") +
                    "?example_id=" +
                    encodeURIComponent(this.data.filepath))
                .addClass("btn btn-danger btn-xs")
                .attr("target", "_blank")
                .text('Delete'));
        }
        btns.append($('<a/>')
            .attr("href",
                utils.url_join_encode(this.base_url, "examples/preview") +
                "?example_id=" +
                encodeURIComponent(this.data.filepath))
            .addClass("btn btn-info btn-xs")
            .attr("target", Jupyter._target)
            .text('Preview'));
        btns.append($('<button/>')
            .addClass("btn btn-success btn-xs")
            .attr("data-toggle", "modal")
            .attr("data-target", "#modal-" + this.hash(this.data.filepath))
            .text('Use'));
        row.append(btns);
        row.append(this.make_modal(this.data.filepath));
        this.element.empty().append(row);
    };

    Example.prototype.make_modal = function(example_id) {
        var that = this;
        var modal_dialog;
        var modal_content;
        var modal_header;
        var modal_title;
        var form;
        var modal_body;
        var modal_footer;
        var dest_label;
        var dest_form_group;
        var dest_input;
        var hidden_input;
        var submit_button;
        var cancel_button;
        var dumb = $('<div/>');
        var container = $('<div/>')
            .addClass("modal")
            .addClass("fade")
            .attr("id", "modal-" + this.hash(example_id))
            .attr("tabindex", "-1")
            .attr("role", "dialog")
            .attr("aria-labelledby", "myModalLabel-" + this.hash(example_id));
        modal_dialog = $('<div/>')
            .addClass("modal-dialog")
            .attr("role", "document")
        modal_content = $('<div/>')
            .addClass("modal-content")
        modal_header = $('<div/>')
            .addClass("modal-header")
        modal_title = $('<h4/>')
            .addClass("modal-title")
            .attr("id", "myModalLabel-" + this.hash(example_id))
            .text("Fetch a fresh copy to your notebook directory")
        form = $('<form/>')
            .attr("action", "examples/fetch")
            .attr("method", "get")
            .attr("target", Jupyter._target)
        modal_body = $('<div/>')
            .addClass("modal-body")
        cancel_button = $('<button/>')
            .addClass("btn")
            .addClass("btn-default")
            .attr("type", "button")
            .attr("data-dismiss", "modal")
            .text("Cancel")
        submit_button = $('<button/>')
            .addClass("btn")
            .addClass("btn-primary")
            .attr("type", "submit")
            .text("Fetch a Copy")
        modal_footer = $('<div/>')
            .addClass("modal-footer")
        dest_form_group = $('<div/>')
            .addClass("form-group")
        dest_label = $('<label/>')
            .addClass("control-label")
            .attr("for", "dest-" + this.hash(example_id))
            .text("Save Copy As")
        dest_input = $('<input/>')
            .attr("type", "text")
            .attr("name", "dest")
            .attr("id", "dest-" + this.hash(example_id))
        hidden_input = $('<input/>')
            .attr("type", "hidden")
            .attr("name", "example_id")
            .attr("value", example_id)
        modal_body.append(dest_label);
        modal_body.append(dest_input);
        modal_body.append(hidden_input);
        modal_footer.append(cancel_button);
        modal_footer.append(submit_button);
        form.append(modal_body);
        form.append(modal_footer);
        modal_header.append(modal_title);
        modal_content.append(modal_header);
        modal_content.append(form);
        modal_content.append(modal_header);
        modal_content.append(form);  // form contains body and footer
        modal_dialog.append(modal_content);
        container.append(modal_dialog);

        return container;
    };

    return {
        'Examples': Examples,
        'Example': Example
    };
});
